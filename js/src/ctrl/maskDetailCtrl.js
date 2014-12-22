mask.controller('MaskDetailCtrl',['$scope', 'MaskDetail', 'Map', 'RequestData', 'UserData', 'API', 'ListData', 'Sence', function($scope, MaskDetail, Map, RequestData, UserData, API, ListData, Sence){
    var ctrl = this;

    ctrl.loadMore = false;
    ctrl.loading = true;
    ctrl.lists = [];
    ctrl.starImg = false;
    ctrl.isSubmit = false;
    
    ctrl.setCoords = function (latitude, longitude) {
        if(longitude == 200){
            ctrl.starImg = true;
        }else{
            ctrl.starImg = false;
            var coords = {latitude: latitude,longitude:longitude};
            Map.setMarker(coords);
        }
        
    }

    ctrl.getById = function(id) {
        var lists = ListData.replys;
        
        for (var i = lists.length - 1; i >= 0; i--) {
            var num = parseInt(lists[i].id, 10);
            if (num === id) {
                return lists[i];
            }
        };
    }

    ctrl.delById = function(id, arr){
        var lists = arr;                 
        for (var i = lists.length - 1; i >= 0; i--) {
            if (lists[i].id == id) {
                return lists.splice(i, 1);
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
        RequestData.addCmtAtt(id, 1).then(function(msg){
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
        RequestData.addCmtAtt(id, 2).then(function(msg){
            // // console.log(msg);         
        }, function(result){
            // alert(result.error);
        });
    }

    ctrl.delComment = function(id){
        ctrl.delById(id, ListData.replys);
        // var postData = {
        //     commentid : id
        // };
        // var httpData = {
        //     method : 'POST',
        //     url : API.DEL_CMT,
        //     data : postData
        // };
        // var timer = null, n = 0;
        // timer = setInterval(function(){
        //     RequestData.loadData(httpData).then(function(result){
        //         // console.log(result);
        //         clearInterval(timer);
        //     }, function(result){
        //         // console.log(result);
        //         n++;
        //         if(n >=10){
        //             clearInterval(timer);
        //         }
        //     });
        // }, 1000);
        
    }

    ctrl.loadReply = function(cfg){
        var postData = {
            page : cfg.page || 1,
            size : cfg.size || 10,
            sid : cfg.sid,
            id : cfg.id || '',
            dir : cfg.dir || 0
        };
        var httpData = {
            method : 'POST',
            url : API.GET_CMT_LIST,
            data : postData
        };
        RequestData.loadData(httpData).then(function(result){                
            // console.log(result);
            if(result.data.list){
                var lists = result.data.list;
                if(lists.length == 10){
                    ctrl.loadMore = true;
                }else{
                    ctrl.loadMore = false;
                }
                ListData.replys = ListData.replys.concat(lists);
                // ctrl.lists = ctrl.lists.concat(lists);
            }
            ctrl.loading = false;
            if (!ListData.replys.length) {
                ctrl.hasNoData = !0;
            } else {
                ctrl.hasNoData = !1;
            }
        }, function(errmsg){
            // console.log(errmsg);
        });
    }

    ctrl.nextPage = function(){
        ctrl.loadMore = false;
        ctrl.loading = true;
        ctrl.loadReply({
            sid : MaskDetail.detail.id,
            id : ctrl.lists[ctrl.lists.length - 1].id,
            dir : 2
        });
    }

    ctrl.httpPromise = function(cfg){
        var httpData = {
            method : 'POST',
            url : cfg.url,
            data : cfg.postData
        };
        return RequestData.loadData(httpData);
    }

    ctrl.handler = function(str){        
        // // console.log(httpData);
        if(ctrl.isSubmit){
            return;
        }
        ctrl.isSubmit = true;
        window.confirm('确定要'+ str + '这条秘密吗？', function(result){

            if (1 !== result) {
                ctrl.isSubmit = false;
                return;
            }            
            if(str == '删除'){
                ctrl.httpPromise({
                    url : API.DEL_SECRET,
                    postData : {
                        sid : MaskDetail.detail.id
                    }
                }).then(function(data){
                    alert(data.message);                    
                    var scr = ctrl.delById(MaskDetail.detail.id, ListData.lists);
                    Sence.back();
                    ctrl.isSubmit = false;
                }, function(data){
                    alert(data.message);
                    ctrl.isSubmit = false;
                });
            }else{
                ctrl.httpPromise({
                    url : API.ADD_SECRET_REPORT,
                    postData : {
                        secretid : MaskDetail.detail.id
                    }
                }).then(function(data){
                    alert(data.message);
                    ctrl.isSubmit = false;
                }, function(data){
                    alert(data.message);
                    ctrl.isSubmit = false;
                });
            }
        });
        
    }

    function render(detail){
        ListData.replys = [];
        ctrl.setCoords(detail.latitude, detail.longitude);
        ctrl.loadReply({
            sid : detail.id
        });
        if(detail.isme == 1){
            ctrl.str = '删除';
        }else{
            ctrl.str = '举报';
        }
    }
    render(MaskDetail.detail);
//    $scope.$watch(function(){
//        return MaskDetail.detail;
//    }, function(newVal, oldVal, scope){
//        // console.log('detail',newVal);
//        if (isNaN(newVal.latitude)) {
//            return;
//        }
//        render(newVal);
//    }, true);
//
//    $scope.$watch(function(){
//        return ListData.replys;
//    }, function(newVal, oldVal, scope){
//        // console.log('detail',newVal);
//        ctrl.lists = newVal;
//    }, true);
}]);