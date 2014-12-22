mask.controller('MyReplyCtrl', ['$scope', 'MoreData', 'RequestData', 'API', 'MaskDetail', function($scope, MoreData, RequestData, API, MaskDetail){
	var ctrl = this;
	var page = 1;
    
    ctrl.hasNoData = !1;
	ctrl.loadMore = false;
	ctrl.loading = true;

	ctrl.lists = [];

	ctrl.loadList = function(page){
		var postData = {
			page : page,
			size : 10
		};

		var httpData = {
			method : 'POST',
			url : API.GET_MY_LIST,
			data : postData
		};
		// console.log(httpData);
		RequestData.loadData(httpData).then(function(result){
			// console.log(result);
			var lists = result.data.list;
			if(lists.length == 10){
				ctrl.loadMore = true;
			}else{
				ctrl.loadMore = false;
			}				
			ctrl.lists = ctrl.lists.concat(lists);
			ctrl.loading = false;
			if (!ctrl.lists.length) {
			    ctrl.hasNoData = !0;
			} else {
			    ctrl.hasNoData = !1;
			}
		}, function(errmsg){
			// console.log(errmsg);
		})
	};

	ctrl.nextPage = function(){
		page++;
		ctrl.loading = true;
		ctrl.loadMore = false;
		ctrl.loadList(page);
	}

	// ctrl.setDetail = function(sid){
	// 	var detailData = {
	// 		attitude: 0,
	// 		cmtCount: "2",
	// 		content: "这年代挣点钱不容易，强烈要求给加班费.",
	// 		distance: 35,
	// 		id: "104",
	// 		isme: 2,
	// 		latitude: "39.9817313596000000",
	// 		longitude: "116.3088466570000000",
	// 		nickName: "屎大爷",
	// 		publishTime: 1404293823,
	// 		score: 1
	// 	};

	// 	MaskDetail.detail = detailData;
	// }

	$scope.$watch(function(){
		return MoreData.type;
	}, function(newVal, oldVal, scope){
		// // console.log(typeof newVal);
		if(newVal == 'reply'){
			MoreData.type = ''
			ctrl.lists = [];
			page = 1;
			ctrl.loadList(page);
		}				
	}, true);
}]);