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
    
    ctrl.load();

}]);