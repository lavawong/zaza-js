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
}]);