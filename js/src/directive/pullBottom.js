mask.directive('pullBottom', function(){
	return {
		restrict : 'EA',
		replace : true,
		template : '<div class="loading" ng-show="showLoad">loading</div>',
		link: function(scope, element, attrs){
			scope.showLoad = false;
			var scrollEle = element.parent().parent();
			scope.scrollFn = function(){
				var sh = this.scrollHeight;
				var ch = this.clientHeight;
				var st = this.scrollTop;
				if(ch + st == sh){
					// scope.showLoad = true;
					scope.$apply(scope.toTrue);
				}
				// console.log(scope.$parent.list);
				// scope.$apply();
			};
			scope.toTrue = function(){
				scope.showLoad = true;
			};
			scope.toFalse = function(){
				scope.showLoad = false;
			};
			scrollEle.on('scroll', scope.scrollFn);
			
			// scrollEle.scroll(function(){
			// 	var sh = this.scrollHeight;
			// 	var ch = this.clientHeight;
			// 	var st = this.scrollTop;
			// 	if(ch + st == sh){
			// 		scope.showLoad = true;
			// 	}
			// 	// console.log(scope.showLoad);
			// });
		}
	}
});