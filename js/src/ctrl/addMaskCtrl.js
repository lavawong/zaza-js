/* 添加一条mask */
mask.controller('AddMaskCtrl', ['API', 'Map','$http', '$scope', '$rootScope', 'ListData', function(API, Map, $http, $scope, $rootScope, ListData){
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
    
}]);