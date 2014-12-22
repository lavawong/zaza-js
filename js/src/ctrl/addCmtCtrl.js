/* 添加一条mask */
mask.controller('AddCmtCtrl', ['API', 'Map','$http', '$scope', 'MaskDetail', 'ListData', function(API, Map, $http, $scope, MaskDetail, ListData){
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
    
}]);