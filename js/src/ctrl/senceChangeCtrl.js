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
}]);