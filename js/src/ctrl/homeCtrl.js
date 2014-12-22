mask.controller('HomeCtrl',['$scope','RequestData','UserData', 'MaskDetail'
	, 'Map', 'MaskListType','API', 'ListData', '$q', '$rootScope'
	, 'DeviceReady', 'PushNotification', '$http', '$location', '$routeParams'
	, function( $scope, RequestData, UserData, MaskDetail, Map, MaskListType
		, API, ListData, $q, $rootScope, DeviceReady, PushNotification
		, $http, $location, $routeParams){

	$scope.homeTab = $routeParams.homeTab || 1;

	//  url, page, type, uniqueid, id, dir
	function httpPromise(cfg){
		return Map.getCurrentPos().then(function(coords){
			
			var MapPos = Map.getDiagonalPoints(coords);			
			var postData = {
				uniqueid : cfg.uniqueid || '',
				id : cfg.id || '',
				type: cfg.type,
				page : cfg.page || 1,
				dir : cfg.dir || 0,
				pagesize : cfg.pageSzie || 20,
				latitudeone : MapPos.northEastPos.latitude,
				longitudeone : MapPos.northEastPos.longitude,
				latitudetwo : MapPos.southWestPos.latitude,
				longitudetwo : MapPos.southWestPos.longitude,
				latitudethree : MapPos.currentPos.latitude,
				longitudethree : MapPos.currentPos.longitude
			};
			// console.log(postData);
			var httpData = {
				method : 'POST',
				url : cfg.url,
				data : postData
			};
        	return RequestData.loadData(httpData);
		});
	}

	// 开始处理
	function run(){
		if (window.cordova) {
			if (window.device && window.device.uuid) {
				var notifyPromise = PushNotification(pushProcess);
				if (notifyPromise) {
					notifyPromise.then(function(token){
						log('Get token pre 20:', token.substring(0, 20));
						ctrl.login(device.uuid, {							token:token
						});
					}, function(){
						log('Get token error');
						ctrl.login(device.uuid);
					});
				} else {
					ctrl.login(device.uuid);
				}
				
			} else {
				log('设备id或失败');
				ctrl.login('zhihang1');
			}
		} else {
			//var uniqueid = 'zhihang1'; //获取设备号
			ctrl.login('zhihang1');
		}
	}
	// 处理推送
	function pushProcess(evt){
		$timeout(function(){
			MaskDetail.detail = {
                longitude: evt.lng,
                latitude: evt.lat,
                id: evt.sid
            }
            $location.url('/detail/'+evt.sid);
		}, 500);
	}


	var ctrl = this;
	var page = 1;


	ctrl.networkError = false;

	ctrl.hasNoData = !1;
	ctrl.loadMore = false;
	$scope.loading = true;

	ctrl.lists = [];

	var loginTime = 0;
	ctrl.login = function(uniqueid, tokenCfg){
		loginTime ++;

		if (3 < loginTime) {
			ctrl.networkError = false;
			$scope.loading = false;
			return;
		}
		tokenCfg = tokenCfg || {};

		httpPromise({
			url:API.ADD_USER, 
			type:1, 
			page:1, 
			uniqueid:uniqueid
		}).then(function(result){
			if ('A00006' === result.code || 'A00008' === result.code) {
				// console.log(result);
				var userData = {
					session_id : result.data.session_id,
					user_info : result.data.user_info
				};
				UserData.data = userData;
				var lists = result.data.secret_info.list;
				if(result.data.secret_info.total > 20){
					ctrl.loadMore = true;
				}else{
					ctrl.loadMore = false;
				}
				ListData.lists = ListData.lists.concat(lists);		
				$scope.loading = false;
				var hasToken = userData.user_info && parseInt(userData.user_info.pushalert, 10);
				if (!hasToken && tokenCfg.token) {
					$http.post(API.SEND_TOKEN, {
						token:tokenCfg.token
					}).success(function(r){
						log('send token success: ', r);
					}).error(function(e){
					});
				}
				
			} else {
				ctrl.login(uniqueid);
			}
			
		}, function(errmsg){
			ctrl.networkError = false;
			$scope.loading = false;
			// console.log(errmsg)
		});
	}

	ctrl.loadList = function(id){		
		httpPromise({
			url:API.GET_LIST, 
			type:1, 
			dir: 2,
			id : id
		}).then(function(result){					
			// console.log(result);
			var lists = result.data.list;
			if(lists.length == 20){
				ctrl.loadMore = true;
			}else{
				ctrl.loadMore = false;
			}
			ListData.lists = ListData.lists.concat(lists);
			$scope.loading = !1;
		}, function(errmsg){
			$scope.loading = !1;
			// console.log(errmsg)
		});
	}

	ctrl.nextPage = function(){
		var id = ctrl.lists[ctrl.lists.length-1].id;
		// // console.log(page);
		ctrl.loadMore = false;
		$scope.loading = true;
		ctrl.loadList(id);
	}

	ctrl.getById = function(id) {
		var lists = ListData.lists;
		
		for (var i = lists.length - 1; i >= 0; i--) {
			var num = parseInt(lists[i].id, 10);
			if (num === id) {
				return lists[i];
			}
		};
	}

	ctrl.up = function(id){
		var item = ctrl.getById(id);
		if(item.attitude == 1){
			alert('您已经顶过！');
			return;
		}else if(item.attitude == 2){
			alert('您已经踩过！');
			return;
		}
		item.attitude = 1;
		item.score += 1;
		UserData.data.user_info.score = parseInt(UserData.data.user_info.score, 10) + 1;
		RequestData.addSecretAtt(id, 1).then(function(msg){
			// console.log(msg);		
		}, function(result){
			// alert(result.error);
		});
	}
	ctrl.down = function(id){
		var item = ctrl.getById(id);		
		if(item.attitude == 1){
			alert('您已经顶过！');
			return;
		}else if(item.attitude == 2){
			alert('您已经踩过！');
			return;
		}
		var item = ctrl.getById(id);
		item.attitude = 2;
		item.score -= 1;
		if(item.score <= -10){
			ctrl.delSecret(id);
		}
		RequestData.addSecretAtt(id, 2).then(function(msg){
			// // console.log(msg);			
		}, function(result){
			// alert(result.error);
		});		
	}

	ctrl.delSecret = function(id){
		var lists = ListData.lists;					
		for (var i = lists.length - 1; i >= 0; i--) {
			var num = parseInt(lists[i].id, 10);
			if (num === id) {
				lists.splice(i, 1);
				break;
			}
		};		
	}

	ctrl.setDetail = function(id) {
		MaskDetail.detail = ListData.findMask(parseInt(id));
		location.hash = ('/detail/'+id);
		RequestData.sudaJsonp('21_01_02_' + id);
	}


	ctrl.pull = function(){
		if (!ctrl.isActive()) {
			return 
		}
		function getFirst(list){
            var mask;
            for (var i = 0; i < list.length; i++) {
                mask = list[i];
                if (!mask.isMe){
                    return mask;
                }
            }
            return null;
        }

        function removeAdd(list) {
        	var mask;
            for (var i = 0; i < list.length; i++) {
                mask = list[i];
                if (mask.isMe){
                    list.splice(i,1);
                    i--;
                }
            }
            
        }

		var deferred = $q.defer();
		
        var postData = {},
        	currentList = ListData.lists,
        	firstItem = getFirst(currentList);

        if (firstItem) {
        	postData = {
        		url  : API.GET_LIST, 
				type : 1, 
				dir  : 1,
				id   : firstItem.id
        	}
        } else {
        	firstItem = { id: 0 };
        	postData = {
        		url  : API.GET_LIST, 
				type : 1, 
				page : 1
        	}
        }
        httpPromise(postData).then(function(result){	
			// console.log('pullRefresh', result.data);
			if ('A00006' === result.code) {
				var list = result.data.list;
				// 新数据多于10，刷新页面
				var mask, needRefresh
					, length = 10;

				if ((currentList.length > 0) && (firstItem)) {
					for (var i = list.length - 1; i >= 0; i--) {
						mask = list[i];
						if (parseInt(firstItem.id) > parseInt(mask.id, 10)){
							list.pop();
						}
					}
				}
				
				if (list.length >= length) {
					ctrl.lists = ListData.lists = [].concat(list);
				} else {
					removeAdd(ListData.lists);
					ctrl.lists = ListData.lists = list.concat(ListData.lists);
				}
				deferred.resolve();
			} else {
				deferred.reject();
			}
			$scope.loading = !1;
		}, function(errmsg){
			$scope.loading = !1;
			deferred.reject();
		});
		return deferred.promise;
	}


    ctrl.reRun = function(){
    	$scope.loading = true;
    	ctrl.networkError = false;
    	DeviceReady.reRun();
    }

    ctrl.currentTab = 1;

    ctrl.setTab = function(tab){
        ctrl.currentTab = tab;
        //ctrl.tab.currentType = tab;
    }

    ctrl.isTabSelect = function(tab){
        return tab === ctrl.tcurrentTab;
    }

	$scope.$watch(function(){
		return ListData.lists
	},function(newVal, oldVal, scope){
		if(newVal.length == 0){
			return;
		}
		ctrl.lists = newVal;
	},true);

	run();

	DeviceReady.then(function(){
		
		var sendCode = function(type){
			Map.getCurrentPos().then(function(coords){
				// console.log(coords);
				var code = '21_01_01_' + UserData.data.id + '_' + coords.latitude + '_' + coords.longitude + '_' + type;
				//log('suda code: ', code);
				RequestData.sudaJsonp(code);
			});
		}
        var onPause = function(){
        	sendCode('pause');
	    }

	    var onResume = function(){
	        sendCode('resume');
	    }
	    document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
		
		window.onerror = function(e){
		    log(e.stack);
		}
		var now;
		$('a.tabs-a.recently').on('touchstart', function(){
			now = Date.now();
		}).on('touchend', function(){
			var split = Date.now() - now;
			if (split > 15000) {
				$('#log').show();
			} else {
				$('#log').hide();
			}
		})

	}, function(config){
		$scope.loading = false;
    	ctrl.networkError = true;
	});
    
}]);	
