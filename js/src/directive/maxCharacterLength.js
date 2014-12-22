mask.directive('maxCharacterLength', ['byteLength', function(byteLength) {
    
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var maxLength = 2 * parseInt(attrs.maxCharacterLength);
            ctrl.$parsers.unshift(function(viewValue) {
                elm.$error;
                var length = byteLength(viewValue);
                if (length <= maxLength) {
                    ctrl.$setValidity('maxCharacterLength', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('maxCharacterLength', false);
                    return viewValue;
                }
            });
        }
    };
}]);