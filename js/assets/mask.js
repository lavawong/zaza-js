var mask = angular.module('mask', ['ngRoute', 'ngTouch', 'ngAnimate'], ['$httpProvider',
    function ($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] =
            'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '',
                name, value, fullSubName, subName, subValue,
                innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' +
                    encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) :
                query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [
            function (data) {
                return angular.isObject(data) && String(data) !==
                    '[object File]' ? param(data) : data;
            }
        ];
    }
]);

// session id
mask.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);

function log(){
    if (!arguments.length) {
        return
    }
    var msgArr = [];
    var log = document.getElementById('log');
    var el = document.createElement('p');
    var val;
    for (var i =0, len = arguments.length ; i < len; i++) {
        val = arguments[i];
        if ('object' === typeof val) {
            msgArr.push(JSON.stringify(val));
        } else {
            msgArr.push(val);
        }
    }
    el.textContent = msgArr.join(', ');
    log.appendChild(el);
}


;
mask.factory('API', function(){
    return {
        ADD_MASK : 'http://yifei2.sinaapp.com//api/secret/add_mimi',
        
        ADD_USER : 'http://yifei2.sinaapp.com/api/user/add',

        GET_LIST :'http://yifei2.sinaapp.com/api/secret/getlist',

        ADD_SECRET_ATT : 'http://yifei2.sinaapp.com/api/attitude/add_secret_att',
        GET_CMT_LIST : 'http://yifei2.sinaapp.com/api/comment/getlist',

        ADD_CMT_ATT : 'http://yifei2.sinaapp.com/api/attitude/add_cmt_att',

        GET_MY_SECRET_LIST : 'http://yifei2.sinaapp.com/api/secret/get_my_secret_list',

        GET_MY_LIST : 'http://yifei2.sinaapp.com/api/comment/getMylist',

        ADD_CMT : 'http://yifei2.sinaapp.com/api/comment/add',

        GET_HOT_PLACE_LIST : 'http://yifei2.sinaapp.com/api/hotRecomment/get_hot_place_secret',

        GET_HOT_TOPIC_LIST : 'http://yifei2.sinaapp.com/api/hotRecomment/get_secret_list',

        GET_HOT_RECOMMENT : 'http://yifei2.sinaapp.com/api/hotRecomment/getlist',

        UPDATE_NICK : 'http://yifei2.sinaapp.com/api/user/update_nickname',

        ADD_SECRET_REPORT : 'http://yifei2.sinaapp.com/api/garbage/add_secret_report',
		
        DEL_SECRET: 'http://yifei2.sinaapp.com/api/secret/del',

        DEL_CMT : 'http://yifei2.sinaapp.com/api/comment/del',

        SEND_TOKEN: 'http://yifei2.sinaapp.com/api/user/add_token',

        MAP_URL : 'http://webapi.amap.com/maps?v=1.3&key=e8fe5b88f7eb073acccb31d0562023fa',

        SUDA_URL : 'http://hits.sinajs.cn/A2/b.html'
    }
});
;
/* 设备API */
mask.factory('DeviceApi', function(){


    document.addEventListener('deviceready', function(){
    }, false);

    
    return {
    };
});;
// 设备初始化成功处理
mask.factory('DeviceReady', ['$q', 'API', function($q, API){
    var deferred = $q.defer();

    var isExecute = false;
    // 获取插件
    var getPlugin = function(pluginName) {
        // 'nl.x-services.plugins.socialsharing.SocialSharing'
        return cordova.require(pluginName);
    }

    // 获取高德地图scirpt
    var getAmapScript = function (){
        var now = Date.now();
        var script = document.createElement('script');
        script.onload = function(){
            var spendTime = Date.now() - now;
            var count = 0;
            var timer = setInterval(function(){
                if (window.AMap) {
                    deferred.resolve();
                    clearInterval(timer);
                }

                if (count > 10) {
                    deferred.inject({error: 'MAP'});
                    script.abort();
                    //alert('无法链接到网络，请检查你的网络设置');
                    clearInterval(timer);
                }
                count ++;
            }, spendTime);
            
        }
        script.onerror = function(){
            deferred.inject({error: 'MAP'});
        }
        script.charset = 'utf-8';
        script.src = API.MAP_URL;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    }

    // 注册登录
    var onDeviceReady = function(){ //设备准备完毕    
        log('deviceReady:', isExecute);
        if (isExecute) {
            return
        }
        

        var notify={};
        if (window.cordova) {
            window.device = cordova.plugins.sinauuid;
            window.socialsharing = getPlugin('nl.x-services.plugins.socialsharing.SocialSharing');
            notify = getPlugin('org.apache.cordova.dialogs.notification');
        }
        window._alert = window.alert;
        window._confirm = window.confirm;

        window.alert = function(msg, func){
            func = func || function(){};
            if (notify.alert) {
                notify.alert(msg, func, '提示', '确定');
            } else {
                window._alert(msg);
                func && func();
            }
            
        }
        window.confirm = function(msg, func){
            func = func || function(){};
            if (notify.confirm) {
                notify.confirm(msg, func, '提示', ['确定', '取消']);
            } else {
                var bool = window._confirm(msg);
                func && func( bool ? 1 : 2 );
            }
        }
        try {
            isExecute = true;
            if (window.AMap) {
                deferred.resolve();
            } else {
                log('should get AMap');
                getAmapScript();
            }
        }catch(e){
            log(e.message);
        }
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    if (!window.cordova) {
        window.addEventListener("load", onDeviceReady, false);
    }

    deferred.promise.reRun = function(){
        getAmapScript();
    }

    return deferred.promise;
}]);;
mask.factory('httpRequestInterceptor', ['UserData', 'URI', function (UserData, URI) {
  return {
    request: function (config) {
      var sessionId = UserData.data.session_id;
      if (sessionId) {
        config.url =  URI(config.url).addSearch({'session_id':sessionId}).toString();
      }
      return config;
    }
  };
}]);;
mask.factory('ListData', function(){
	return {
		lists : [],
		replys : []
	}
});;
/* 地图服务 */
mask.factory('Map', ['$q',function($q){
    var mapObj, toolBar, mapMarker, 
        offsetLng = 0.0064932, 
        offsetLat = -0.000869,
        defaults = {
            longitude: 116.308868, // 116.30237483797654,
            latitude: 39.983558// 39.98268836580624
        },
        starCoords = {
            longitude: 200,
            latitude: 200
        }
    function offset(coords){
        return {
            longitude: coords.longitude + offsetLng,
            latitude : coords.latitude  + offsetLat
        }
    }

    return {
        // 获取当前位置
        getCurrentPos: function(){
            var deferred = $q.defer();
            if ('geolocation' in navigator){
                navigator.geolocation.getCurrentPosition(function(pos){
                    
                    var coords = offset(pos.coords);
                    
                    deferred.resolve(coords);
                    // cb('A00006', coords);
                 }, function(){
                    deferred.resolve(starCoords);
                 }, { // 解决有时不返回error的错误
                    maximumAge:60000, 
                    timeout:5000
                });
            } else {
                deferred.resolve(starCoords);
            }
            return deferred.promise;
        },
        getPos: function(coords){
            var lng = coords.longitude,
                lat = coords.latitude;
            if ((180 < lng) || (-180 > lng) || (90 < lat) || (-90 > lat)) {
                return null;
            }
            return new AMap.LngLat(coords.longitude, coords.latitude);
        },
        getMap: function(pos, level){
            
            if (!mapObj) {
                mapObj = new AMap.Map("map-container",{
                    center: pos, 
                    level: level || 18
                });
                mapObj.plugin(["AMap.ToolBar"],function(){     
                    toolBar = new AMap.ToolBar();
                    mapObj.addControl(toolBar);    
                });
            } else {
                try{
                    mapObj.setCenter(pos);
                } catch(e) {
                }
            }
            return mapObj;
        },
        setMarker: function(coords){

            var pos = this.getPos(coords);
            var map;
            if (!pos) {
                pos = this.getPos(defaults);
                map = this.getMap(pos);
            } else {
                map = this.getMap(pos);
            }
            if (!mapMarker) {
                mapMarker = new AMap.Marker({ //自定义构造AMap.Marker对象               
                  position: pos,
                  zIndex: 3,               
                  offset: new AMap.Pixel(-10,-34),                
                  icon: "../style/images/mapicon.png"                
                });
                mapMarker.setMap(map);
            } else {
                mapMarker.show();
                mapMarker.setPosition(pos);
            }
            
            
            window.marker = mapMarker;
        },
        /**
         * 获取东北与西南偏移3KM的坐标
         * @param {JSON} coords 示例：{longitude: 116.33455522, latitude: 37.22342342}
         */
        getDiagonalPoints: function(coords){
            var pos = this.getPos(coords);
            if (!pos) {
                return {
                    northEastPos: {
                        longitude: 200,
                        latitude:  200
                    },
                    southWestPos: {
                        longitude: 200,
                        latitude:  200
                    },
                    currentPos: {
                        longitude: 200,
                        latitude: 200
                    }
                }
            } else {
                var northEastPos = pos.offset(3000, 3000);
                var southWestPos = pos.offset(-6000, -6000);
                return {
                    northEastPos: {
                        longitude: northEastPos.getLng(),
                        latitude:  northEastPos.getLat()
                    },
                    southWestPos: {
                        longitude: southWestPos.getLng(),
                        latitude:  southWestPos.getLat()
                    },
                    currentPos: {
                        longitude: coords.longitude,
                        latitude: coords.latitude
                    }
                }
            }
        }
    }
}]);;
/* mask详细信息服务 */
mask.factory('MaskDetail', function(){
    return {
        detail: {}
    };
});;
/* mask信息列表标记服务 */
mask.factory('MaskListType', function(){
    return {
        // 1. latest 最新 
        // 2. hottest 最热
        // 3. mine 我的
        currentType: 1,
        /* 更改当前信息列表 */
        changeType: function(type){
            this.currentType = type;
        } 
    }
});;
mask.factory('MD5', function(){
/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
var MD5 = function (string) {
 
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
     }
 
     function F(x,y,z) { return (x & y) | ((~x) & z); }
     function G(x,y,z) { return (x & z) | (y & (~z)); }
     function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
 
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
 
    x = ConvertToWordArray(string);
 
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
 
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
    return temp.toLowerCase();
}

return MD5;   
})
;
mask.factory('MoreData', function(){
	return {
		myLists : [],
		myReplys : [],
		type : '' // 类型 'secret' 我的秘密 | 'reply' 我的评论
	}
});;
// APN推送处理
mask.factory('PushNotification', ['Sence', 'DeviceReady'
    , '$q', 'MaskDetail'
    , function(Sence, DeviceReady, $q, MaskDetail){
    
    var promise = null;

    return function(cb){

        if (!window.cordova || promise) {
            return promise;
        }
        
        // 接收通知的延迟
        window.onNotificationAPN = function(event) {
            log(event);
            cb(event);
        };
        var pushNotification = window.plugins.pushNotification;
        
        var defer = $q.defer();
        pushNotification.register(
            function(token){
                defer.resolve(token);
            }, function(){
                defer.reject();
            }, {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"onNotificationAPN"
            }
        );
        promise = defer.promise;
        return promise;
    }
}]);;
mask.factory('Recomment', function(){
    return {
        type  : '', // 推荐类型 place: 地点 | topic: 话题
        id : '', // 推荐内容的id
        value : '',
        change : function(type, id, value){
            this.type = type;
            this.id   = id;
            this.value = value
        }
    }
});;
/* 各种请求服务 */
mask.factory('RequestData', ['$http', '$q','Map', 'API',function($http, $q, Map, API){
	// var deferred = $q.defer();
	return {
		
		// 发表对秘密的态度（顶，踩）
		addSecretAtt : function(id , type){
			var deferred = $q.defer();
			var postData = {
				secretid : id,
				attitude : type
			};
			
			// // console.log(postData);
			$http({
				method : 'POST',
				url : API.ADD_SECRET_ATT,
				data : postData
			}).success(function(result, status, headers, config){
				// // console.log('suc: ',result);
				if(result.code == 'A00006'){
					deferred.resolve(result.message);
				}else{
					deferred.reject(result);
				}
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				// deferred.reject(result);
			});
			return deferred.promise;
		},			
		// 发表对评论的态度（顶，踩）
		addCmtAtt : function(id , type){
			var deferred = $q.defer();
			var postData = {
				cmtid : id,
				attitude : type
			};
			// // console.log(postData);
			$http({
				method : 'POST',
				url : API.ADD_CMT_ATT,
				data : postData
			}).success(function(result, status, headers, config){
				// // console.log('suc: ',result);
				if(result.code == 'A00006'){
					deferred.resolve(result.message);
				}else{
					deferred.reject(result);
				}
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				// deferred.reject(result);
			});
			return deferred.promise;
		},			
		// 请求数据封装promise方法
		loadData : function(httpData){
			var deferred = $q.defer();
			$http(httpData).success(function(result, status, headers, config){
				// // console.log('suc: ',result);
				if(result.code == 'A00006' || result.code == 'A00008'){				
					deferred.resolve(result);
				}else{
					deferred.reject(result);
				}
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				// deferred.reject(result);
			});
			return deferred.promise;
		},
		// 用于布码的jsonp请求
		sudaJsonp : function(code){
			var deferred = $q.defer();
			var config = {
				params : {
					type : code,
					callback : 'JSON_CALLBACK'
				}
			}
			$http.jsonp(API.SUDA_URL, config).success(function(result, status, headers, config){
				// // console.log('suc: ',result);		
				deferred.resolve(result);
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				deferred.reject(result);
			});
			return deferred.promise;
		}
	}
}]);;
mask.factory('Sence', function(){
    var defaultPage = 'home';
    var path = [defaultPage];
    return {
        currentPage: defaultPage,        
        changePage: function(page){
            // // console.log('changePage', page, path, path.length);
            if (path.length > 1 && (page === path[path.length - 2]) ) {
                path.pop();
            } else {
                path.push(page);
            }
            this.currentPage = page;
            
        },
        back: function(){
            // // console.log('back', path);
            path.pop();
            if (path.length > 0) {
                this.currentPage = path[path.length-1];
            } else {
                this.currentPage = defaultPage;
                path.push(defaultPage);
            }
        }
    }
});;
mask.factory('ShareData', function(){
    return {};
});;
mask.factory('URI', function(){
    function URI(url){
        this.parse(url);
    }

    URI.prototype = {
        constructor : URI,
        params : {},
        api : '',
        addSearch : function(param){
            for (var p in param) {
                if (param.hasOwnProperty(p)) {
                    this.params[p] = param[p];
                }
            }
            return this;
        },
        parse : function(url){
            var index = url.indexOf('?');
            var params = {};
            var api, queryStr, querys;
            
            if (index > -1) {
                var api = url.substring(0, index);
                var queryStr = url.substring(index+1);
                var querys;
                queryStr.split('&').forEach(function(val, i){
                    querys = val.split('=');
                    params[querys[0]] = querys[1] || '';
                });
            } else {
                api = url;
            }
            this.params = params;
            this.api    = api;
            return this;
        },
        toString : function(){
            var queryStr = [], params = this.params;
            for (var p in params) {
                if (params.hasOwnProperty(p)) {
                    queryStr.push(p + '=' + params[p]);
                }
            }
            return this.api + '?' + queryStr.join('&');
        }
    }
    return function(url){
        return new URI(url);
    }
});;
/* 用户信息服务 */
mask.factory('UserData', function(){
	return {
		data : {}
	};
});;
mask.filter('changeDistance', function(){
	return function(dis){
		var str = '';
		if(dis < 100){
			str = '<100m';
		}else if(dis >= 100 && dis < 500){
			str = '<500m';
		}else if(dis >= 500 && dis < 1000){
			str = '<1km';
		}else if(dis >= 1000 && dis < 2000){
			str = '<2km';
		}else{
			str = '>2km';
		}
		return str;
	}
});;
mask.filter('changeTime', function(){
	return function(time){
		var cur = new Date().getTime();
	    var des, str, num, hour, day;
	    des = cur/1000 - time;
	    num = Math.floor(des/60);
	    if(num < 1 ){
	        str = '刚刚';
	    }else if(num >= 1 && num <60){
	        str =  num + '分钟前';
	    }else if(num >= 60 && num < (60*24)){
	        hour = Math.floor(num/60);
	        str = hour + '小时前';
	    }else if(num >= (60*24) && num < (60*24*30)){
	        day = Math.floor(num/(60*24));
	        str = day + '天前';
	    }else{
	        str = '超过30天';
	    }
	    return str;
	}
});;
mask.filter('limitCharacters', ['byteLength', function(byteLength){
    return function(input, length){
        // return length - Math.ceil(byteLength(input)/2);
        if(typeof input == 'undefined'){
        	return length;
        }else {
        	return length - input.length;
        }
        
    }
}]);;
mask.filter('outOfLimit', ['byteLength', function(byteLength){
    return function(input, length){
        // return Math.ceil(byteLength(input)/2) - length;
        if(typeof input == 'undefined'){
        	return length;
        }else {
        	return input.length - length;
        }
        
    }
}]);;
mask.service('byteLength', function(){

    var UNICODE_REGEXP = /[^\x00-\x80]/g;

    var byteLength = function(str){
        if(typeof str == "undefined"){
            return 0;
        }
        var aMatch = str.match(/[^\x00-\x80]/g);
        return (str.length + (!aMatch ? 0 : aMatch.length));
    };
    return byteLength;
});;
mask.service('changeTime', function(){
  return function (data){
    if (!data) {
      return [];
    }
    var cur = new Date().getTime();   
    for(var i = 0; i <data.length; i++){
      var des = cur - data[i].publishTime;
      var num = Math.floor(des/(1000*60));
      var str = num +'分钟前';
      data[i].passTime = str;
    }
    return data;
  }
});;
mask.directive('autoFocus', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function ( scope, element, attrs ) {
            var focusValue = attrs.autoFocusValue;
            //var param = scope.$eval(attrs.autoFocus);
            scope.$watch(attrs.autoFocus, function (newVal, oldVal, scope) {
                if ( newVal == focusValue ) {
                    $(element[0]).focus();
                }
            }, true);
            
        }
    };
}]);;
mask.directive('hotRecomment', ['RequestData', function(RequestData){
    return {
        restrict: 'E',
        templateUrl: 'hotRecommentTpl.html',
        controller: 'HotRecommentCtrl',
        controllerAs: 'recmtCtrl'
    }
}]);;
mask.directive('hotTab', ['RequestData', function(RequestData){
	return {
		restrict: 'E',
		templateUrl: 'hotTabTpl.html'
	}
}]);;
mask.directive('listSet',['$rootScope', function($rootScope){

	return {
		restrict : 'EA',
		replace : true,
		templateUrl : 'listTpl.html',
        link : function(scope, element, attrs){

        }
	}
}]);;
mask.directive('maxCharacterLength', ['byteLength', function(byteLength) {
    
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var maxLength = 2 * parseInt(attrs.maxCharacterLength);
            ctrl.$parsers.unshift(function(viewValue) {
                var length = byteLength(viewValue);
                if (length <= maxLength) {
                    ctrl.$setValidity('maxCharacterLength', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('maxCharacterLength', false);
                    return viewValue;
                }
            });
        }
    };
}]);;
mask.directive('myReplyList', function(){
	return {
		restrict : 'EA',
		replace : true,
		templateUrl : 'myReplyListTpl.html',
		link : function(scope, element, attrs){

		}
	}
});;
mask.directive('pullBottom', function(){
	return {
		restrict : 'EA',
		replace : true,
		template : '<div class="loading" ng-show="showLoad">loading</div>',
		link: function(scope, element, attrs){
			scope.showLoad = false;
			var scrollEle = element.parent().parent();
			scope.scrollFn = function(){
				var sh = this.scrollHeight;
				var ch = this.clientHeight;
				var st = this.scrollTop;
				if(ch + st == sh){
					// scope.showLoad = true;
					scope.$apply(scope.toTrue);
				}
				// console.log(scope.$parent.list);
				// scope.$apply();
			};
			scope.toTrue = function(){
				scope.showLoad = true;
			};
			scope.toFalse = function(){
				scope.showLoad = false;
			};
			scrollEle.on('scroll', scope.scrollFn);
			
			// scrollEle.scroll(function(){
			// 	var sh = this.scrollHeight;
			// 	var ch = this.clientHeight;
			// 	var st = this.scrollTop;
			// 	if(ch + st == sh){
			// 		scope.showLoad = true;
			// 	}
			// 	// console.log(scope.showLoad);
			// });
		}
	}
});;
/* pull to refresh 处理*/
mask.directive('pullRefresh', function(){
    var isTouch = !!('ontouchstart' in window);
    var cfg = {
        loaderror : {
            clz : 'icons_1',
            msg : '刷新失败'
        },
        loadsucc : {
            clz : 'icons_2',
            msg : '刷新成功'
        },
        loading : {
            clz : 'icons_3',
            msg : '正在刷新…'
        },
        touchmove : {
            clz : 'icons_4',
            msg : '释放立即刷新'
        },
        touchstart : {
            clz : 'icons_5',
            msg : '下拉刷新'
        }
    }
    var tpl = ['<div class="loading" style="background-color:initial;height:20px;min-width:290px;position:absolute; top: -1000px;">',
        '<i class="icons"></i><span class="x-js-msg"></span>',
      '</div>'].join('');

    function BindRefresh(ctrl, scope, elem){
        
        if (!isTouch || !ctrl) {
            return;
        } else if(!ctrl.pull || !ctrl.isActive) {
            return
        }
        //// console.log(scope.selector);
        function findParent(el, clz){
            while (el = el.parentNode){
                if (el.className === clz) {
                    break;
                }
            }
            return el;
        }

        function setClzAndMsg(action){
            iconEl.get(0).className = 'icons '+cfg[action].clz;
            msgEl.text(cfg[action].msg);
        }

        function getXY(evt){
            var touchObj = evt.originalEvent.changedTouches[0];
            return {x : touchObj.clientX, y : touchObj.clientY};
        }

        function reset(){
            setClzAndMsg('touchstart');
            ptr.css('position','absolute');
            //ptr.height(1);
        }

        function loadSuccess(){
            setClzAndMsg('loadsucc');
            setTimeout(reset, 1000);
        }

        function loadError(){
            setClzAndMsg('loaderror');
            setTimeout(reset, 1000);
        }
        
        var content = angular.element(findParent(elem.get(0), 'mask-content')),
            ptr = elem.find('.loading', elem), 
            iconEl = elem.find('.icons', elem),
            fixedEl = elem.find('.x-js-fixed', elem),
            msgEl  = elem.find('.x-js-msg', elem),
            
            
            ptrHeight = 30,
    
            isActivated = !1,
            offsetY = 0,
            start = {x:0, y:0},
            current = {x:0, y:0},
            isRelease = !1,
            isDrag = !1,
            startTime;
        
        content.on('touchstart', function (ev) {
            startTime = Date.now();
            if (!ctrl.isActive()) {
                return;
            }
            // console.log('elem.scrollTop:',content.scrollTop());
            if (content.scrollTop() === 0) { // fix scrolling
                content.scrollTop(1);
            }
            ptrHeight = ptr.height();
            start = getXY(ev);
            offsetY = 0;
            isRelease = !1;
        }).on('touchmove', function (ev) {
            var top = content.scrollTop();
            if (!ctrl.isActive() || content.scrollTop()>1) {
                return;
            }
            
            current = getXY(ev);

            offsetY = current.y - start.y;
            if (offsetY < 50) {
                return
            }
            var split = Date.now() - startTime;

            if (split < 50) {
                return;
            }
            
            ptr.css({position:'static'});

            if (offsetY >= (ptrHeight+20)) { // release state
                setClzAndMsg('touchmove');
                isRelease = !0;
            } else if (top < 2) {  // pull state
                setClzAndMsg('touchstart');
            }
        }).on('touchend', function(ev) {
            if (!ctrl.isActive()) {
                return;
            }
            fixedEl.height(ptrHeight);
            setClzAndMsg('loading');
            var promise;
            if (isRelease && (promise = ctrl.pull())) {
                promise.then(loadSuccess, loadError);
            }
            isRelease = !1;
        });
    }
    
    return {
        restrict: 'EA',
        template: tpl,
        scope: false,
        link: function(scope, elem, attrs){
            var ctrl = scope.$eval(attrs.pullCall);
            if (!ctrl.pull) {
                return;
            }
            //log(callBack.toString());
            new BindRefresh(ctrl, scope, elem);
        }
    }
});;
mask.directive('replyList', function(){
	return{
		restrict : 'EA',
		replace : true,
		templateUrl : 'replyListTpl.html',
		link : function(scope, element, attrs){
			scope.page = attrs.page;
		}
	}
});;
/* 社交网站分享 */
mask.directive('socialShare', ['DeviceApi', 'MaskDetail','$rootScope', 'RequestData', function(DeviceApi, MaskDetail, $rootScope, RequestData){
    
    var html = ['<div class="mask-bgcolor"></div>',
          '<div class="mask-share">',
            '<span class="share-icon">',
              '<a href="#" action-type="sinaweibo" class="lk_a m-txt3"><i class="icon icon_1"></i>新浪微博</a>',
              '<a href="#" action-type="tecentweibo" class="lk_a m-txt3"><i class="icon icon_2"></i>腾讯微博</a>',
              //'<a href="#" class="lk_a m-txt3"><i class="icon icon_3"></i>QQ空间</a>',
            '</span>',
            '<span class="share-btn">',
              '<a href="#" action-type="cancel" ng-click="shareClick=!1" class="lk_a m-txt4">取消分享</a>',
            '</span>',
          '</div>',
        '</div>']
    return {
        restrict: 'E',
        template: html.join(''),
        link: function(scope, element, attr){
            var weiboBtn = element.find('a[action-type="sinaweibo"]');
            var tecentBtn = element.find('a[action-type="tecentweibo"]');
            var cancelBtn = element.find('a[action-type="cancel"]');

            function share (com) {
                // console.log(MaskDetail.detail);
                if (!socialsharing) {
                    alert('分享失败');
                    element.addClass('ng-hide');
                } else {
                    socialsharing.shareVia(com, MaskDetail.detail.content, null, null, '', function(){
                        element.addClass('ng-hide');
                        RequestData.sudaJsonp('21_01_05_' + MaskDetail.detail.id);
                    }, function(msg) {
                        alert('分享失败')
                    });
                }               
            }
            weiboBtn.bind('touch click', function(){
                share('com.apple.social.sinaweibo')
            });
            tecentBtn.bind('touch click', function(){
                share('com.apple.social.tencentweibo')
            });
            cancelBtn.bind('touch click', function(){
                element.addClass('ng-hide');
            });
            $rootScope.$on('share_btn_touch', function(scope){
                element.removeClass('ng-hide');
            });
            element.addClass('ng-hide');
        }
    }
}]);;
/* 添加一条mask */
mask.controller('AddCmtCtrl', ['API', 'Map', 'Sence','$http', '$scope', 'MaskDetail', 'ListData', function(API, Map, Sence, $http, $scope, MaskDetail, ListData){
    var ctrl = this;
    ctrl.isSubmit = !1;
    ctrl.mask = {content:''};

    ctrl.addCmt = function() {
        if (ctrl.isSubmit) {
            return;
        }
        ctrl.isSubmit = !0;
        Map.getCurrentPos().then(function(coords){
            $http.post(API.ADD_CMT, {
                secrectId : MaskDetail.detail.id,
                content   : ctrl.mask.content,
                longitude : coords.longitude, 
                latitude  : coords.latitude
            }).success(function(result){
                ctrl.isSubmit = !1;
                // console.log(result);
                if ('A00006' === result.code) {
                    Sence.back();
                    ctrl.reset();
                    ListData.replys.unshift(result.data);
                    var item = ctrl.getById(MaskDetail.detail.id);
                    item.cmtCount = parseInt(item.cmtCount, 10) + 1;
                }
                alert(result.message);
            }).error(function(data){
                ctrl.isSubmit = !1;
                alert('提交失败');
            });
            
        }, function(msg){
            ctrl.isSubmit = !1;
            // console.log(msg);

        });
        
    }

    ctrl.getById = function(id) {
        var lists = ListData.lists;
        
        for (var i = lists.length - 1; i >= 0; i--) {
            if (lists[i].id == id) {
                return lists[i];
            }
        };
    }

    ctrl.reset = function(){
        $scope.cmtForm.$setPristine();
        ctrl.mask.content = '';
        ctrl.isSubmit = !1;
    }
    
}]);;
/* 添加一条mask */
mask.controller('AddMaskCtrl', ['API', 'Map', 'Sence','$http', '$scope', '$rootScope', 'ListData', function(API, Map, Sence, $http, $scope, $rootScope, ListData){
    var ctrl = this;
    ctrl.isSubmit = !1;
    ctrl.mask = {content:''};

    ctrl.addMask = function() {
        if (ctrl.isSubmit) {
            return;
        }
        ctrl.isSubmit = !0;
        Map.getCurrentPos().then(function(coords){
            $http.post(API.ADD_MASK, {
                content   : ctrl.mask.content,
                longitude : coords.longitude, 
                latitude  : coords.latitude
            }).success(function(result){
                ctrl.isSubmit = !1;
                if ('A00006' === result.code) {
                    Sence.back();
                    ctrl.reset();
                    result.data.isMe = true;
                    ListData.lists.unshift(result.data);
                }
                alert(result.message);
            }).error(function(data){
                ctrl.isSubmit = !1;
                alert('提交失败');
            });
            
        }, function(msg){
            ctrl.isSubmit = !1;
            // console.log(msg);

        });
        
    }

    ctrl.reset = function(){
        $scope.maskForm.$setPristine();
        ctrl.mask.content = '';
        ctrl.isSubmit = !1;
    }
    
}]);;
mask.controller('HomeCtrl',['$scope','RequestData','UserData', 'MaskDetail'
	, 'Map', 'MaskListType','API', 'ListData', '$q', '$rootScope', 'Sence'
	, 'DeviceReady', 'PushNotification', '$http'
	, function( $scope, RequestData, UserData, MaskDetail, Map, MaskListType
		, API, ListData, $q, $rootScope, Sence, DeviceReady, PushNotification
		, $http){
	//  url, page, type, uniqueid, id, dir
	function httpPromise(cfg){
		return Map.getCurrentPos().then(function(coords){
			
			var MapPos = Map.getDiagonalPoints(coords);			
			var postData = {
				uniqueid : cfg.uniqueid || '',
				id : cfg.id || '',
				type: cfg.type,
				page : cfg.page || 1,
				dir : cfg.dir || 0,
				pagesize : cfg.pageSzie || 20,
				latitudeone : MapPos.northEastPos.latitude,
				longitudeone : MapPos.northEastPos.longitude,
				latitudetwo : MapPos.southWestPos.latitude,
				longitudetwo : MapPos.southWestPos.longitude,
				latitudethree : MapPos.currentPos.latitude,
				longitudethree : MapPos.currentPos.longitude
			};
			// console.log(postData);
			var httpData = {
				method : 'POST',
				url : cfg.url,
				data : postData
			};
        	return RequestData.loadData(httpData);
		});
	}

	// 开始处理
	function run(){
		
		if (window.cordova) {
			if (window.device && window.device.uuid) {
				var notifyPromise = PushNotification(pushProcess);
				if (notifyPromise) {
					notifyPromise.then(function(token){
						log('Get token pre 20:', token.substring(0, 20));
						ctrl.login(device.uuid, {							token:token
						});
					}, function(){
						log('Get token error');
						ctrl.login(device.uuid);
					});
				} else {
					ctrl.login(device.uuid);
				}
				
			} else {
				log('设备id或失败');
				ctrl.login('zhihang1');
			}
		} else {
			//var uniqueid = 'zhihang1'; //获取设备号
			ctrl.login('zhihang1');
		}
	}

	function pushProcess(evt){
		setTimeout(function(){
			try{
				$scope.$apply(function(){
		            Sence.changePage('detail');
		            MaskDetail.detail = {
		                longitude: evt.lng,
		                latitude: evt.lat,
		                id: evt.sid
		            }
		        });
			} catch(e) {
				log(e.stack);
			}
		}, 500);
	}


	var ctrl = this;
	var page = 1;


	ctrl.networkError = false;

	ctrl.hasNoData = !1;
	ctrl.loadMore = false;
	$scope.loading = true;

	ctrl.lists = [];

	var loginTime = 0;
	ctrl.login = function(uniqueid, tokenCfg){
		loginTime ++;

		if (3 < loginTime) {
			ctrl.networkError = false;
			$scope.loading = false;
			return;
		}
		tokenCfg = tokenCfg || {};

		httpPromise({
			url:API.ADD_USER, 
			type:1, 
			page:1, 
			uniqueid:uniqueid
		}).then(function(result){
			if ('A00006' === result.code || 'A00008' === result.code) {
				// console.log(result);
				var userData = {
					session_id : result.data.session_id,
					user_info : result.data.user_info
				};
				UserData.data = userData;
				var lists = result.data.secret_info.list;
				if(result.data.secret_info.total > 20){
					ctrl.loadMore = true;
				}else{
					ctrl.loadMore = false;
				}
				ListData.lists = ListData.lists.concat(lists);		
				$scope.loading = false;
				var hasToken = userData.user_info && parseInt(userData.user_info.pushalert, 10);
				if (!hasToken && tokenCfg.token) {
					$http.post(API.SEND_TOKEN, {
						token:tokenCfg.token
					}).success(function(r){
						log('send token success: ', r);
					}).error(function(e){
					});
				}
				
			} else {
				ctrl.login(uniqueid);
			}
			
		}, function(errmsg){
			ctrl.networkError = false;
			$scope.loading = false;
			// console.log(errmsg)
		});
	}

	ctrl.loadList = function(id){		
		httpPromise({
			url:API.GET_LIST, 
			type:1, 
			dir: 2,
			id : id
		}).then(function(result){					
			// console.log(result);
			var lists = result.data.list;
			if(lists.length == 20){
				ctrl.loadMore = true;
			}else{
				ctrl.loadMore = false;
			}
			ListData.lists = ListData.lists.concat(lists);
			$scope.loading = !1;
		}, function(errmsg){
			$scope.loading = !1;
			// console.log(errmsg)
		});
	}

	ctrl.nextPage = function(){
		var id = ctrl.lists[ctrl.lists.length-1].id;
		// // console.log(page);
		ctrl.loadMore = false;
		$scope.loading = true;
		ctrl.loadList(id);
	}

	ctrl.getById = function(id) {
		var lists = ListData.lists;
		
		for (var i = lists.length - 1; i >= 0; i--) {
			var num = parseInt(lists[i].id, 10);
			if (num === id) {
				return lists[i];
			}
		};
	}

	ctrl.up = function(id){
		var item = ctrl.getById(id);
		if(item.attitude == 1){
			alert('您已经顶过！');
			return;
		}else if(item.attitude == 2){
			alert('您已经踩过！');
			return;
		}
		item.attitude = 1;
		item.score += 1;
		UserData.data.user_info.score = parseInt(UserData.data.user_info.score, 10) + 1;
		RequestData.addSecretAtt(id, 1).then(function(msg){
			// console.log(msg);		
		}, function(result){
			// alert(result.error);
		});
	}
	ctrl.down = function(id){
		var item = ctrl.getById(id);		
		if(item.attitude == 1){
			alert('您已经顶过！');
			return;
		}else if(item.attitude == 2){
			alert('您已经踩过！');
			return;
		}
		var item = ctrl.getById(id);
		item.attitude = 2;
		item.score -= 1;
		if(item.score <= -10){
			ctrl.delSecret(id);
		}
		RequestData.addSecretAtt(id, 2).then(function(msg){
			// // console.log(msg);			
		}, function(result){
			// alert(result.error);
		});		
	}

	ctrl.delSecret = function(id){
		var lists = ListData.lists;					
		for (var i = lists.length - 1; i >= 0; i--) {
			var num = parseInt(lists[i].id, 10);
			if (num === id) {
				lists.splice(i, 1);
				break;
			}
		};		
	}

	ctrl.setDetail = function(id) {
		MaskDetail.detail = ctrl.getById(id);
		RequestData.sudaJsonp('21_01_02_' + id);
	}



	ctrl.isActive = function(){
		return 1 === MaskListType.currentType && 'home' === Sence.currentPage;
	};

	ctrl.pull = function(){
		if (!ctrl.isActive()) {
			return 
		}
		function getFirst(list){
            var mask;
            for (var i = 0; i < list.length; i++) {
                mask = list[i];
                if (!mask.isMe){
                    return mask;
                }
            }
            return null;
        }

        function removeAdd(list) {
        	var mask;
            for (var i = 0; i < list.length; i++) {
                mask = list[i];
                if (mask.isMe){
                    list.splice(i,1);
                    i--;
                }
            }
            
        }

		var deferred = $q.defer();
		
        var postData = {},
        	currentList = ListData.lists,
        	firstItem = getFirst(currentList);

        if (firstItem) {
        	postData = {
        		url  : API.GET_LIST, 
				type : 1, 
				dir  : 1,
				id   : firstItem.id
        	}
        } else {
        	firstItem = { id: 0 };
        	postData = {
        		url  : API.GET_LIST, 
				type : 1, 
				page : 1
        	}
        }
        httpPromise(postData).then(function(result){	
			// console.log('pullRefresh', result.data);
			if ('A00006' === result.code) {
				var list = result.data.list;
				// 新数据多于10，刷新页面
				var mask, needRefresh
					, length = 10;

				if ((currentList.length > 0) && (firstItem)) {
					for (var i = list.length - 1; i >= 0; i--) {
						mask = list[i];
						if (parseInt(firstItem.id) > parseInt(mask.id, 10)){
							list.pop();
						}
					}
				}
				
				if (list.length >= length) {
					ctrl.lists = ListData.lists = [].concat(list);
				} else {
					removeAdd(ListData.lists);
					ctrl.lists = ListData.lists = list.concat(ListData.lists);
				}
				deferred.resolve();
			} else {
				deferred.reject();
			}
			$scope.loading = !1;
		}, function(errmsg){
			$scope.loading = !1;
			deferred.reject();
		});
		return deferred.promise;
	}


    ctrl.reRun = function(){
    	$scope.loading = true;
    	ctrl.networkError = false;
    	DeviceReady.reRun();
    }

	$scope.$watch(function(){
		return ListData.lists
	},function(newVal, oldVal, scope){
		if(newVal.length == 0){
			return;
		}
		ctrl.lists = newVal;
	},true);


	DeviceReady.then(function(){
		run();
		var sendCode = function(type){
			Map.getCurrentPos().then(function(coords){
				// console.log(coords);
				var code = '21_01_01_' + UserData.data.id + '_' + coords.latitude + '_' + coords.longitude + '_' + type;
				//log('suda code: ', code);
				RequestData.sudaJsonp(code);
			});
		}
        var onPause = function(){
        	sendCode('pause');
	    }

	    var onResume = function(){
	        sendCode('resume');
	    }
	    document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
		
		window.onerror = function(e){
		    log(e.stack);
		}
		var now;
		$('a.tabs-a.recently').on('touchstart', function(){
			now = Date.now();
		}).on('touchend', function(){
			var split = Date.now() - now;
			if (split > 15000) {
				$('#log').show();
			} else {
				$('#log').hide();
			}
		})

	}, function(config){
		$scope.loading = false;
    	ctrl.networkError = true;
	});
    
}]);	
;
// 最热list
mask.controller('HotListCtrl', ['$rootScope', '$scope', '$http', 'MaskDetail',
    'Map', 'RequestData', 'UserData', 'Sence', 'API', 'Recomment', '$q',
    function ($rootScope, $scope, $http, MaskDetail, Map, RequestData,
        UserData, Sence, API, Recomment, $q) {
        var ctrl = this;
        var page = 1;
        ctrl.loadMore = false;
        $scope.loading = true;

        ctrl.hasNoData = !1;

        ctrl.isLoading = !1;

        ctrl.title = '';

        ctrl.lists = [];

        ctrl.getById = function (id) {
            var lists = ctrl.lists;

            for (var i = lists.length - 1; i >= 0; i--) {
                var num = parseInt(lists[i].id, 10);
                if (num === id) {
                    return lists[i];
                }
            };
        }

        ctrl.up = function(id){
            var item = ctrl.getById(id);
            if(item.attitude == 1){
                alert('您已经顶过！');
                return;
            }else if(item.attitude == 2){
                alert('您已经踩过！');
                return;
            }
            item.attitude = 1;
            item.score += 1;
            UserData.data.user_info.score = parseInt(UserData.data.user_info.score, 10) + 1;
            RequestData.addSecretAtt(id, 1).then(function(msg){
                // console.log(msg);        
            }, function(result){
                // alert(result.error);
            });
        }
        ctrl.down = function(id){
            var item = ctrl.getById(id);        
            if(item.attitude == 1){
                alert('您已经顶过！');
                return;
            }else if(item.attitude == 2){
                alert('您已经踩过！');
                return;
            }
            var item = ctrl.getById(id);
            item.attitude = 2;
            item.score -= 1;
            if(item.score <= -10){
                ctrl.delSecret(id);
            }
            RequestData.addSecretAtt(id, 2).then(function(msg){
                // // console.log(msg);         
            }, function(result){
                // alert(result.error);
            });     
        }

        ctrl.delSecret = function(id){
            var lists = ctrl.lists;                 
            for (var i = lists.length - 1; i >= 0; i--) {
                var num = parseInt(lists[i].id, 10);
                if (num === id) {
                    lists.splice(i, 1);
                    break;
                }
            };
        }

        ctrl.setDetail = function (id) {
            MaskDetail.detail = ctrl.getById(id);
            RequestData.sudaJsonp('21_01_03_' + id);
        }

        ctrl.reset = function () {
            ctrl.loadMore = false;
            $scope.loading = true;
            ctrl.isLoading = !0;
            ctrl.hasNoData = !1;
            ctrl.lists = [];
        }

        ctrl.loadList = function (recomment, page) {

            ctrl.title = recomment.value;

            page = page || 1;
            var url = (recomment.type === 'place') ? API.GET_HOT_PLACE_LIST :
                API.GET_HOT_TOPIC_LIST;

            $http.post(url, {
                id: recomment.id,
                page: page,
                pagesize: 10
            }).success(function (result, status, headers,
                config) {
                // console.log(result);
                if ('A00006' == result.code) {
                    var lists = result.data.list;
                    if (lists.length == 10) {
                        ctrl.loadMore = true;
                    } else {
                        ctrl.loadMore = false;
                    }
                    ctrl.lists = ctrl.lists.concat(lists);
                    $scope.loading = false;
                    if (!ctrl.lists.length) {
                        ctrl.hasNoData = !0;
                    } else {
                        ctrl.hasNoData = !1;
                    }
                } else {
                    alert('数据加载出错');
                }

            }).error(function (errmsg) {
                alert('数据加载出错');
            });
        }

        ctrl.nextPage = function () {
            page++;
            ctrl.loadMore = false;
            $scope.loading = true;
            ctrl.loadList(Recomment, page);
        }
        ctrl.isActive = function(){
            return Sence.currentPage === 'hotlist';
        }
        ctrl.pull = function(){
            if (!ctrl.isActive()) {
                return;
            }
            function getFirst(list){
                var mask;
                for (var i = 0; i < list.length; i++) {
                    mask == list[i];
                    if (mask){
                        return mask;
                    }
                }
                return null;
            }

            var deferred = $q.defer();

            var postData = {},
                currentList = ctrl.lists,
                firstItem = getFirst(currentList);

            var url = (Recomment.type === 'place') ? API.GET_HOT_PLACE_LIST :
                API.GET_HOT_TOPIC_LIST;
            if (firstItem) {
                postData = {
                    type: 1,
                    dir: 1,
                    id: firstItem.id
                }
            } else {
                postData = {
                    type: 1,
                    page: 1
                }
            }
            $http.post(url, {
                id: Recomment.id,
                dir: 1,
                pagesize: 10
            }).success(function (result, status, headers,
                config) {
                // console.log('pullRefresh', result.data);
                if ('A00006' === result.code) {
                    var list = result.data.list;
                    // 新数据多于10，刷新页面
                    var mask, needRefresh, length = 10;

                    if ((currentList.length > 0) && firstItem) {
                        for (var i = list.length - 1; i >=
                            0; i--) {
                            mask = list[i];
                            if (parseInt(firstItem.id) > parseInt(mask.id, 10)) {
                                list.pop();
                            }
                        }
                    }

                    if (list.length >= length) {
                        ctrl.lists = [].concat(list);
                    } else {
                        ctrl.lists = list.concat(ctrl.lists);
                    }

                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }).error(function (errmsg) {
                deferred.reject();
            });

            return deferred.promise;
        }

        // 监听tab的变化然后更新页面
        $scope.$watch(function () {
            return Recomment;
        }, function (newVal, oldVal, scope) {
            // // console.log(newVal);
            if (newVal.id !== oldVal.id || newVal.type !==
                oldVal.type) {
                ctrl.reset();
                ctrl.loadList(newVal);
            }
        }, true);
    }
]);;
// 首页最热推荐列表
mask.controller('HotRecommentCtrl', ['$rootScope', '$scope', '$http', 'API', 'MaskListType', 'Recomment', '$q', 'Sence', 'RequestData', function($rootScope, $scope, $http, API, MaskListType, Recomment, $q, Sence, RequestData){
    var ctrl = this;

    ctrl.placeList = [];

    ctrl.topicList = [];

    $scope.loading = !0;

    ctrl.load = function(cfg){
        $scope.loading = !0;
        cfg = cfg || {};
        var deferred = cfg.defer;
        //(!deferred) && ($scope.loading = !0);
        $http.post(API.GET_HOT_RECOMMENT, {
            page: 1,
            pagesize: 20
        }).success(function(result, status, headers, config){

            if ('A00006' === result.code) {
                $scope.loading = !1;
                ctrl.placeList = result.data.place_info;
                ctrl.topicList = result.data.topic_info;
                deferred && deferred.resolve();
            } else {
                deferred && deferred.reject();
                $scope.loading = !1;
            }
        }).error(function(result, status, headers, config){
            deferred && deferred.reject();
            $scope.loading = !1;
        });
    }

    ctrl.setRecomment = function(type, id, val){
        Recomment.change(type, id, val);
        RequestData.sudaJsonp('21_01_04_' + id);
    }
    ctrl.isActive = function(){
        return 2 === MaskListType.currentType && 'home' === Sence.currentPage;
    }
    ctrl.pull = function(){
        if (!ctrl.isActive()) {
            return 
        }

        var deferred = $q.defer();

        ctrl.load({defer: deferred});

        return deferred.promise;
    }

    $scope.$watch(function(){ 
        return MaskListType.currentType;
    }, function(newVal, oldVal, scope){
        if (newVal === 2) {
            ctrl.load();
        }
    });

}]);;
mask.controller('MaskDetailCtrl',['$scope', 'MaskDetail', 'Map', 'RequestData', 'UserData', 'API', 'ListData', 'Sence', function($scope, MaskDetail, Map, RequestData, UserData, API, ListData, Sence){
    var ctrl = this;

    ctrl.loadMore = false;
    ctrl.loading = true;
    ctrl.lists = [];
    ctrl.starImg = false;
    ctrl.isSubmit = false;
    
    ctrl.setCoords = function (latitude, longitude) {
        if(longitude == 200){
            ctrl.starImg = true;
        }else{
            ctrl.starImg = false;
            var coords = {latitude: latitude,longitude:longitude};
            Map.setMarker(coords);
        }
        
    }

    ctrl.getById = function(id) {
        var lists = ListData.replys;
        
        for (var i = lists.length - 1; i >= 0; i--) {
            var num = parseInt(lists[i].id, 10);
            if (num === id) {
                return lists[i];
            }
        };
    }

    ctrl.delById = function(id, arr){
        var lists = arr;                 
        for (var i = lists.length - 1; i >= 0; i--) {
            if (lists[i].id == id) {
                return lists.splice(i, 1);
            }
        };
    }

    ctrl.up = function(id){
        var item = ctrl.getById(id);
        if(item.attitude == 1){
            alert('您已经顶过！');
            return;
        }else if(item.attitude == 2){
            alert('您已经踩过！');
            return;
        }
        item.attitude = 1;
        item.score += 1;
        UserData.data.user_info.score = parseInt(UserData.data.user_info.score, 10) + 1;
        RequestData.addCmtAtt(id, 1).then(function(msg){
            // console.log(msg);        
        }, function(result){
            // alert(result.error);
        });        
    }
    ctrl.down = function(id){
        var item = ctrl.getById(id);        
        if(item.attitude == 1){
            alert('您已经顶过！');
            return;
        }else if(item.attitude == 2){
            alert('您已经踩过！');
            return;
        }
        var item = ctrl.getById(id);
        item.attitude = 2;
        item.score -= 1;
        if(item.score <= -10){
            ctrl.delSecret(id);
        }
        RequestData.addCmtAtt(id, 2).then(function(msg){
            // // console.log(msg);         
        }, function(result){
            // alert(result.error);
        });
    }

    ctrl.delComment = function(id){
        ctrl.delById(id, ListData.replys);
        // var postData = {
        //     commentid : id
        // };
        // var httpData = {
        //     method : 'POST',
        //     url : API.DEL_CMT,
        //     data : postData
        // };
        // var timer = null, n = 0;
        // timer = setInterval(function(){
        //     RequestData.loadData(httpData).then(function(result){
        //         // console.log(result);
        //         clearInterval(timer);
        //     }, function(result){
        //         // console.log(result);
        //         n++;
        //         if(n >=10){
        //             clearInterval(timer);
        //         }
        //     });
        // }, 1000);
        
    }

    ctrl.loadReply = function(cfg){
        var postData = {
            page : cfg.page || 1,
            size : cfg.size || 10,
            sid : cfg.sid,
            id : cfg.id || '',
            dir : cfg.dir || 0,
        };
        var httpData = {
            method : 'POST',
            url : API.GET_CMT_LIST,
            data : postData
        };
        RequestData.loadData(httpData).then(function(result){                
            // console.log(result);
            if(result.data.list){
                var lists = result.data.list;
                if(lists.length == 10){
                    ctrl.loadMore = true;
                }else{
                    ctrl.loadMore = false;
                }
                ListData.replys = ListData.replys.concat(lists);
                // ctrl.lists = ctrl.lists.concat(lists);
            }
            ctrl.loading = false;
            if (!ListData.replys.length) {
                ctrl.hasNoData = !0;
            } else {
                ctrl.hasNoData = !1;
            }
        }, function(errmsg){
            // console.log(errmsg);
        });
    }

    ctrl.nextPage = function(){
        ctrl.loadMore = false;
        ctrl.loading = true;
        ctrl.loadReply({
            sid : MaskDetail.detail.id,
            id : ctrl.lists[ctrl.lists.length - 1].id,
            dir : 2
        });
    }

    ctrl.httpPromise = function(cfg){
        var httpData = {
            method : 'POST',
            url : cfg.url,
            data : cfg.postData
        };
        return RequestData.loadData(httpData);
    }

    ctrl.handler = function(str){        
        // // console.log(httpData);
        if(ctrl.isSubmit){
            return;
        }
        ctrl.isSubmit = true;
        window.confirm('确定要'+ str + '这条秘密吗？', function(result){

            if (1 !== result) {
                ctrl.isSubmit = false;
                return;
            }            
            if(str == '删除'){
                ctrl.httpPromise({
                    url : API.DEL_SECRET,
                    postData : {
                        sid : MaskDetail.detail.id
                    }
                }).then(function(data){
                    alert(data.message);                    
                    var scr = ctrl.delById(MaskDetail.detail.id, ListData.lists);
                    Sence.back();
                    ctrl.isSubmit = false;
                }, function(data){
                    alert(data.message);
                    ctrl.isSubmit = false;
                });
            }else{
                ctrl.httpPromise({
                    url : API.ADD_SECRET_REPORT,
                    postData : {
                        secretid : MaskDetail.detail.id
                    }
                }).then(function(data){
                    alert(data.message);
                    ctrl.isSubmit = false;
                }, function(data){
                    alert(data.message);
                    ctrl.isSubmit = false;
                });
            }
        });
        
    }

    function render(detail){
        ListData.replys = [];
        ctrl.setCoords(detail.latitude, detail.longitude);
        ctrl.loadReply({
            sid : detail.id
        });
        if(detail.isme == 1){
            ctrl.str = '删除';
        }else{
            ctrl.str = '举报';
        }
    }

    $scope.$watch(function(){
        return MaskDetail.detail;
    }, function(newVal, oldVal, scope){
        // console.log('detail',newVal);
        if (isNaN(newVal.latitude)) {
            return;
        }
        render(newVal);
    }, true);

    $scope.$watch(function(){
        return ListData.replys;
    }, function(newVal, oldVal, scope){
        // console.log('detail',newVal);
        ctrl.lists = newVal;
    }, true);
}]);;
mask.controller('MoreCtrl', ['$scope', 'RequestData', 'UserData', 'MoreData', 'API', function($scope, RequestData, UserData, MoreData, API){
	var ctrl = this;

	ctrl.setType = function(type){
		MoreData.type = type;
	};
}]);;
mask.controller('MyListCtrl', ['$scope', 'MoreData', 'MaskDetail', 'RequestData', 'API', 'Sence', '$q', function($scope, MoreData, MaskDetail, RequestData, API, Sence, $q){
	var ctrl = this;
	var page = 1;

	ctrl.hasNoData = !1;
	ctrl.loadMore = false;
	$scope.loading = !0;

	ctrl.lists = [];

	ctrl.loadList = function(page){
		var postData = {
			page : page,
			size : 10
		};

		var httpData = {
			method : 'POST',
			url : API.GET_MY_SECRET_LIST,
			data : postData
		};
		RequestData.loadData(httpData).then(function(result){				
			var lists = result.data.list;
			if(lists.length == 10){
				ctrl.loadMore = true;
			}else{
				ctrl.loadMore = false;
			}
			ctrl.lists = ctrl.lists.concat(lists);
			// console.log(ctrl.lists);
			$scope.loading = false;
			if (!ctrl.lists.length) {
			    ctrl.hasNoData = !0;
			} else {
			    ctrl.hasNoData = !1;
			}
		}, function(errmsg){
			// console.log(errmsg);
		})
	};

	ctrl.nextPage = function(){
		page++;
		$scope.loading = true;
		ctrl.loadMore = false;
		ctrl.loadList(page);
	}

	ctrl.setDetail = function(id) {
		var lists = ctrl.lists;
		
		for (var i = lists.length - 1; i >= 0; i--) {
			var num = parseInt(lists[i].id, 10);
			if (num === id) {
				MaskDetail.detail = lists[i];
				break;
			}
		};
	}

/*
    ctrl.pull = function(){
        if ('myList' !== Sence.currentPage) {
            return 
        }


        var firstMask = MoreData.myLists[0];

        if (!firstMask) {
        	firstMask = { id:0 };
        }

        var deferred = $q.defer();

        var postData = {
				page : page,
				size : 10
			};
		
		var httpData = {
			method : 'POST',
			url : API.GET_MY_SECRET_LIST,
			data : postData
		};
		RequestData.loadData(httpData).then(function(result){
			if ('A00006' === result.code) {
				var lists = result.data.list;
				
				var news = [], mask;
				for (var i = lists.length - 1; i >= 0; i--) {
					mask = lists[i];
					if (firstMask.id < mask.id) {
						news.push(mask);
					}
				}
				console.log(news);
				// 添加最新的内容
				if(news.length > 10){
					MoreData.myLists = news;
					ctrl.lists = news;
					page = 1;
				}else{
					MoreData.myLists = MoreData.myLists.concat(news);
					ctrl.lists = ctrl.lists.concat(news);
				}				
				
				deferred.resolve();
			} else {
				deferred.reject();
			}
		}, function(errmsg){
			deferred.reject();
		});

        return deferred.promise;
    }
*/

	$scope.$watch(function(){
		return MoreData.type;
	}, function(newVal, oldVal, scope){
		// console.log(newVal);
		if(newVal == 'secret'){
			MoreData.type = ''
			ctrl.lists = [];
			page = 1;
			ctrl.loadList(page);
		}				
	});			
}]);;
mask.controller('MyReplyCtrl', ['$scope', 'MoreData', 'RequestData', 'API', 'MaskDetail', function($scope, MoreData, RequestData, API, MaskDetail){
	var ctrl = this;
	var page = 1;
    
    ctrl.hasNoData = !1;
	ctrl.loadMore = false;
	ctrl.loading = true;

	ctrl.lists = [];

	ctrl.loadList = function(page){
		var postData = {
			page : page,
			size : 10
		};

		var httpData = {
			method : 'POST',
			url : API.GET_MY_LIST,
			data : postData
		};
		// console.log(httpData);
		RequestData.loadData(httpData).then(function(result){
			// console.log(result);
			var lists = result.data.list;
			if(lists.length == 10){
				ctrl.loadMore = true;
			}else{
				ctrl.loadMore = false;
			}				
			ctrl.lists = ctrl.lists.concat(lists);
			ctrl.loading = false;
			if (!ctrl.lists.length) {
			    ctrl.hasNoData = !0;
			} else {
			    ctrl.hasNoData = !1;
			}
		}, function(errmsg){
			// console.log(errmsg);
		})
	};

	ctrl.nextPage = function(){
		page++;
		ctrl.loading = true;
		ctrl.loadMore = false;
		ctrl.loadList(page);
	}

	// ctrl.setDetail = function(sid){
	// 	var detailData = {
	// 		attitude: 0,
	// 		cmtCount: "2",
	// 		content: "这年代挣点钱不容易，强烈要求给加班费.",
	// 		distance: 35,
	// 		id: "104",
	// 		isme: 2,
	// 		latitude: "39.9817313596000000",
	// 		longitude: "116.3088466570000000",
	// 		nickName: "屎大爷",
	// 		publishTime: 1404293823,
	// 		score: 1
	// 	};

	// 	MaskDetail.detail = detailData;
	// }

	$scope.$watch(function(){
		return MoreData.type;
	}, function(newVal, oldVal, scope){
		// // console.log(typeof newVal);
		if(newVal == 'reply'){
			MoreData.type = ''
			ctrl.lists = [];
			page = 1;
			ctrl.loadList(page);
		}				
	}, true);
}]);;
/* 场景切换 */
mask.controller('SenceChangeCtrl', ['$rootScope','$scope', 'Sence', 'MaskListType', 'UserData', function($rootScope, $scope, Sence, MaskListType, UserData){
    var ctrl = this;
    
    ctrl.sence = Sence;
    ctrl.tab = MaskListType;
    
    ctrl.toggle = function(page) {
        Sence.changePage(page);
    }

    ctrl.back = function(){
        Sence.back();
    }
    ctrl.isPage = function(page){
        return ctrl.sence.currentPage === page;
    }

    ctrl.share = function(){
        $rootScope.$broadcast('share_btn_touch');
    }

    ctrl.setTab = function(tab){
        MaskListType.changeType(tab);
        //ctrl.tab.currentType = tab;
    }

    ctrl.isTabSelect = function(tab){
        return tab === ctrl.tab.currentType;
    }
    
    $scope.$watch(function(){
        return UserData.data;
    }, function(newVal, oldVal, scope){
        if(typeof newVal.user_info == 'undefined'){
            return;
        }
        ctrl.userData = newVal;
    }, true);
    //// console.log($scope);
}]);;
/* 添加一条mask */
mask.controller('UpdateNickCtrl', ['API', 'Sence','$http', '$scope', 'UserData', function(API, Sence, $http, $scope, UserData){
    var ctrl = this;

    ctrl.nick = '';

    ctrl.isSubmit = !1;

    // 更新nick
    ctrl.updateNick = function(){
        $http.post(API.UPDATE_NICK, {
            nickname: ctrl.nick
        }).success(function(result, status, headers, config){
            ctrl.isSubmit = !0;
            if ('A00006' === result.code) {
                // console.log('昵称修改成功', result);
                Sence.back();
                ctrl.reset();
                UserData.data.nickname = ctrl.nickname;
            }
            alert(result.message);
        }).error(function(result, status, headers, config){
            ctrl.isSubmit = !0;
            // console.log('昵称修改失败', result);
            alert('提交失败');
        });
    }
    ctrl.reset = function(){
        //this.nick = '';
    }

    $scope.$watch(function(){ 
        return UserData.data 
    }, function(newVal){
        
        if (newVal.user_info && newVal.user_info.nickname) {
            ctrl.nick = newVal.user_info.nickname;
        } else {
            ctrl.nick = '';
        }
    }, true);

    
    
}]);