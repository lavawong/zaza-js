/* pull to refresh 处理*/
mask.directive('pullRefresh', function(){
    var isTouch = !!('ontouchstart' in window);
    var cfg = {
        loaderror : {
            clz : 'icons_1',
            msg : '刷新失败'
        },
        loadsucc : {
            clz : 'icons_2',
            msg : '刷新成功'
        },
        loading : {
            clz : 'icons_3',
            msg : '正在刷新…'
        },
        touchmove : {
            clz : 'icons_4',
            msg : '释放立即刷新'
        },
        touchstart : {
            clz : 'icons_5',
            msg : '下拉刷新'
        }
    }
    var tpl = ['<div class="loading" style="background-color:initial;height:20px;min-width:290px;position:absolute; top: -1000px;">',
        '<i class="icons"></i><span class="x-js-msg"></span>',
      '</div>'].join('');

    function BindRefresh(ctrl, scope, elem){
        
        if (!isTouch || !ctrl) {
            return;
        } else if(!ctrl.pull || !ctrl.isActive) {
            return
        }
        //// console.log(scope.selector);
        function findParent(el, clz){
            while (el = el.parentNode){
                if (el.className === clz) {
                    break;
                }
            }
            return el;
        }

        function setClzAndMsg(action){
            iconEl.get(0).className = 'icons '+cfg[action].clz;
            msgEl.text(cfg[action].msg);
        }

        function getXY(evt){
            var touchObj = evt.originalEvent.changedTouches[0];
            return {x : touchObj.clientX, y : touchObj.clientY};
        }

        function reset(){
            setClzAndMsg('touchstart');
            ptr.css('position','absolute');
            //ptr.height(1);
        }

        function loadSuccess(){
            setClzAndMsg('loadsucc');
            setTimeout(reset, 1000);
        }

        function loadError(){
            setClzAndMsg('loaderror');
            setTimeout(reset, 1000);
        }
        
        var content = angular.element(findParent(elem.get(0), 'mask-content')),
            ptr = elem.find('.loading', elem), 
            iconEl = elem.find('.icons', elem),
            fixedEl = elem.find('.x-js-fixed', elem),
            msgEl  = elem.find('.x-js-msg', elem),
            
            
            ptrHeight = 30,
    
            isActivated = !1,
            offsetY = 0,
            start = {x:0, y:0},
            current = {x:0, y:0},
            isRelease = !1,
            isDrag = !1,
            startTime;
        
        content.on('touchstart', function (ev) {
            startTime = Date.now();
            if (!ctrl.isActive()) {
                return;
            }
            // console.log('elem.scrollTop:',content.scrollTop());
            if (content.scrollTop() === 0) { // fix scrolling
                content.scrollTop(1);
            }
            ptrHeight = ptr.height();
            start = getXY(ev);
            offsetY = 0;
            isRelease = !1;
        }).on('touchmove', function (ev) {
            var top = content.scrollTop();
            if (!ctrl.isActive() || content.scrollTop()>1) {
                return;
            }
            
            current = getXY(ev);

            offsetY = current.y - start.y;
            if (offsetY < 50) {
                return
            }
            var split = Date.now() - startTime;

            if (split < 50) {
                return;
            }
            
            ptr.css({position:'static'});

            if (offsetY >= (ptrHeight+20)) { // release state
                setClzAndMsg('touchmove');
                isRelease = !0;
            } else if (top < 2) {  // pull state
                setClzAndMsg('touchstart');
            }
        }).on('touchend', function(ev) {
            if (!ctrl.isActive()) {
                return;
            }
            fixedEl.height(ptrHeight);
            setClzAndMsg('loading');
            var promise;
            if (isRelease && (promise = ctrl.pull())) {
                promise.then(loadSuccess, loadError);
            }
            isRelease = !1;
        });
    }
    
    return {
        restrict: 'EA',
        template: tpl,
        scope: false,
        link: function(scope, elem, attrs){
            var ctrl = scope.$eval(attrs.pullCall);
            if (!ctrl || !ctrl.pull) {
                return;
            }
            //log(callBack.toString());
            new BindRefresh(ctrl, scope, elem);
        }
    }
});