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
}]);