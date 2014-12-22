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
}]);