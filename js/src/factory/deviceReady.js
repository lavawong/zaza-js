// 设备初始化成功处理
mask.factory('DeviceReady', ['$q', 'API', function($q, API){
    var doc = document;
    var deferred = $q.defer();

    var isExecute = false;
    // 获取插件
    var getPlugin = function(pluginName) {
        // 'nl.x-services.plugins.socialsharing.SocialSharing'
        return cordova.require(pluginName);
    }
    window.maskMapBootstrap = function(){
        deferred.resolve();
    }
    // 获取高德地图scirpt
    var getAmapScript = function (){
        var now = Date.now();
        var script = doc.createElement('script');
        script.onerror = function(){
            deferred.reject({error: 'MAP'});
        }
        script.charset = 'utf-8';
        script.src = API.MAP_URL+'&callback=maskMapBootstrap';
        var head = doc.getElementsByTagName('head')[0];
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
    if ('complete' == doc.readyState) {
        onDeviceReady();
    } else {
        doc.addEventListener("deviceready", onDeviceReady, false);
        if (!window.cordova) {
            doc.addEventListener("DOMContentLoad", onDeviceReady, false);
        }
    }
    

    deferred.promise.reRun = function(){
        getAmapScript();
    }

    return deferred.promise;
}]);