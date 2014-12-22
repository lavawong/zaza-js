mask.directive('hotRecomment', ['RequestData', function(RequestData){
    return {
        restrict: 'E',
        templateUrl: 'hotRecommentTpl.html',
        controller: 'HotRecommentCtrl',
        controllerAs: 'recmtCtrl'
    }
}]);