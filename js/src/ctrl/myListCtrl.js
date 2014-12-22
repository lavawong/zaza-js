mask.controller('MyListCtrl', ['$scope', 'MoreData', 'MaskDetail', 'RequestData', 'API', 'Sence', '$q', function($scope, MoreData, MaskDetail, RequestData, API, Sence, $q){
	var ctrl = this;
	var page = 1;

	ctrl.hasNoData = !1;
	ctrl.loadMore = false;
	$scope.loading = !0;

	$scope.showUpAndDown = false;

	ctrl.lists = [];

	ctrl.loadList = function(page){
		var postData = {
			page : page,
			size : 10
		};

		var httpData = {
			method : 'POST',
			url : API.GET_MY_SECRET_LIST,
			data : postData
		};
		RequestData.loadData(httpData).then(function(result){				
			var lists = result.data.list;
			if(lists.length == 10){
				ctrl.loadMore = true;
			}else{
				ctrl.loadMore = false;
			}
			ctrl.lists = ctrl.lists.concat(lists);
			// console.log(ctrl.lists);
			$scope.loading = false;
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
		$scope.loading = true;
		ctrl.loadMore = false;
		ctrl.loadList(page);
	}

	ctrl.setDetail = function(id) {
		var lists = ctrl.lists;
		
		for (var i = lists.length - 1; i >= 0; i--) {
			var num = parseInt(lists[i].id, 10);
			if (num === id) {
				MaskDetail.detail = lists[i];
				break;
			}
		};
	}

/*
    ctrl.pull = function(){
        if ('myList' !== Sence.currentPage) {
            return 
        }


        var firstMask = MoreData.myLists[0];

        if (!firstMask) {
        	firstMask = { id:0 };
        }

        var deferred = $q.defer();

        var postData = {
				page : page,
				size : 10
			};
		
		var httpData = {
			method : 'POST',
			url : API.GET_MY_SECRET_LIST,
			data : postData
		};
		RequestData.loadData(httpData).then(function(result){
			if ('A00006' === result.code) {
				var lists = result.data.list;
				
				var news = [], mask;
				for (var i = lists.length - 1; i >= 0; i--) {
					mask = lists[i];
					if (firstMask.id < mask.id) {
						news.push(mask);
					}
				}
				console.log(news);
				// 添加最新的内容
				if(news.length > 10){
					MoreData.myLists = news;
					ctrl.lists = news;
					page = 1;
				}else{
					MoreData.myLists = MoreData.myLists.concat(news);
					ctrl.lists = ctrl.lists.concat(news);
				}				
				
				deferred.resolve();
			} else {
				deferred.reject();
			}
		}, function(errmsg){
			deferred.reject();
		});

        return deferred.promise;
    }
*/

	$scope.$watch(function(){
		return MoreData.type;
	}, function(newVal, oldVal, scope){
		// console.log(newVal);
		if(newVal == 'secret'){
			MoreData.type = ''
			ctrl.lists = [];
			page = 1;
			ctrl.loadList(page);
		}				
	});			
}]);