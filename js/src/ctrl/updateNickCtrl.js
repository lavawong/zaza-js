/* 添加一条mask */
mask.controller('UpdateNickCtrl', ['API', 'Sence','$http', '$scope'
    , 'UserData', '$location', function(API, Sence, $http, $scope,
                                        UserData, $location){
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
            $location.url('/more');
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