mask.controller('MoreCtrl', ['$scope', 'RequestData', 'UserData', 'MoreData', 'API', function($scope, RequestData, UserData, MoreData, API){
	var ctrl = this;

	ctrl.setType = function(type){
		MoreData.type = type;
	};
}]);