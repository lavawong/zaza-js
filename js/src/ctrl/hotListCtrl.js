// 最热list
mask.controller('HotListCtrl', ['$rootScope', '$scope', '$http', 'MaskDetail',
    'Map', 'RequestData', 'UserData', 'Sence', 'API', 'Recomment', '$q','$routeParams',
    function ($rootScope, $scope, $http, MaskDetail, Map, RequestData,
        UserData, Sence, API, Recomment, $q, $routeParams) {
        var ctrl = this;
        var page = 1;
        ctrl.loadMore = false;
        $scope.loading = true;

        ctrl.hasNoData = !1;

        ctrl.isLoading = !1;

        $scope.title = $routeParams.name || '&nbsp;';


        ctrl.lists = [];

        ctrl.getById = function (id) {
            var lists = ctrl.lists;

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
            var lists = ctrl.lists;                 
            for (var i = lists.length - 1; i >= 0; i--) {
                var num = parseInt(lists[i].id, 10);
                if (num === id) {
                    lists.splice(i, 1);
                    break;
                }
            };
        }

        ctrl.setDetail = function (id) {
            MaskDetail.detail = ctrl.getById(id);
            RequestData.sudaJsonp('21_01_03_' + id);
        }

        ctrl.reset = function () {
            ctrl.loadMore = false;
            $scope.loading = true;
            ctrl.isLoading = !0;
            ctrl.hasNoData = !1;
            ctrl.lists = [];
        }

        ctrl.loadList = function (recomment, page) {

            ctrl.title = recomment.value;

            page = page || 1;
            var url = (recomment.type === 'place') ? API.GET_HOT_PLACE_LIST :
                API.GET_HOT_TOPIC_LIST;

            $http.post(url, {
                id: recomment.id,
                page: page,
                pagesize: 10
            }).success(function (result, status, headers,
                config) {
                // console.log(result);
                if ('A00006' == result.code) {
                    var lists = result.data.list;
                    if (lists.length == 10) {
                        ctrl.loadMore = true;
                    } else {
                        ctrl.loadMore = false;
                    }
                    ctrl.lists = ctrl.lists.concat(lists);
                    $scope.loading = false;
                    if (!ctrl.lists.length) {
                        ctrl.hasNoData = !0;
                    } else {
                        ctrl.hasNoData = !1;
                    }
                } else {
                    alert('数据加载出错');
                }

            }).error(function (errmsg) {
                alert('数据加载出错');
            });
        }

        ctrl.nextPage = function () {
            page++;
            ctrl.loadMore = false;
            $scope.loading = true;
            ctrl.loadList(Recomment, page);
        }
        ctrl.isActive = function(){
            return Sence.currentPage === 'hotlist';
        }
        ctrl.pull = function(){
            if (!ctrl.isActive()) {
                return;
            }
            function getFirst(list){
                var mask;
                for (var i = 0; i < list.length; i++) {
                    mask == list[i];
                    if (mask){
                        return mask;
                    }
                }
                return null;
            }

            var deferred = $q.defer();

            var postData = {},
                currentList = ctrl.lists,
                firstItem = getFirst(currentList);

            var url = (Recomment.type === 'place') ? API.GET_HOT_PLACE_LIST :
                API.GET_HOT_TOPIC_LIST;
            if (firstItem) {
                postData = {
                    type: 1,
                    dir: 1,
                    id: firstItem.id
                }
            } else {
                postData = {
                    type: 1,
                    page: 1
                }
            }
            $http.post(url, {
                id: Recomment.id,
                dir: 1,
                pagesize: 10
            }).success(function (result, status, headers,
                config) {
                // console.log('pullRefresh', result.data);
                if ('A00006' === result.code) {
                    var list = result.data.list;
                    // 新数据多于10，刷新页面
                    var mask, needRefresh, length = 10;

                    if ((currentList.length > 0) && firstItem) {
                        for (var i = list.length - 1; i >=
                            0; i--) {
                            mask = list[i];
                            if (parseInt(firstItem.id) > parseInt(mask.id, 10)) {
                                list.pop();
                            }
                        }
                    }

                    if (list.length >= length) {
                        ctrl.lists = [].concat(list);
                    } else {
                        ctrl.lists = list.concat(ctrl.lists);
                    }

                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }).error(function (errmsg) {
                deferred.reject();
            });

            return deferred.promise;
        }
        ctrl.loadList(Recomment);
    }
]);