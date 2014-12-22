mask.directive('replyList', function(){
	return{
		restrict : 'EA',
		replace : true,
		templateUrl : 'replyListTpl.html',
		link : function(scope, element, attrs){
			scope.page = attrs.page;
		}
	}
});