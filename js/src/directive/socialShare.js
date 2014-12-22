/* 社交网站分享 */
mask.directive('socialShare', ['DeviceApi', 'MaskDetail','$rootScope', 'RequestData', function(DeviceApi, MaskDetail, $rootScope, RequestData){
    
    var html = ['<div class="mask-bgcolor"></div>',
          '<div class="mask-share">',
            '<span class="share-icon">',
              '<a href="#" action-type="sinaweibo" class="lk_a m-txt3"><i class="icon icon_1"></i>新浪微博</a>',
              '<a href="#" action-type="tecentweibo" class="lk_a m-txt3"><i class="icon icon_2"></i>腾讯微博</a>',
              //'<a href="#" class="lk_a m-txt3"><i class="icon icon_3"></i>QQ空间</a>',
            '</span>',
            '<span class="share-btn">',
              '<a href="#" action-type="cancel" ng-click="shareClick=!1" class="lk_a m-txt4">取消分享</a>',
            '</span>',
          '</div>',
        '</div>']
    return {
        restrict: 'E',
        template: html.join(''),
        link: function(scope, element, attr){
            var weiboBtn = element.find('a[action-type="sinaweibo"]');
            var tecentBtn = element.find('a[action-type="tecentweibo"]');
            var cancelBtn = element.find('a[action-type="cancel"]');

            function share (com) {
                // console.log(MaskDetail.detail);
                if (!socialsharing) {
                    alert('分享失败');
                    element.addClass('ng-hide');
                } else {
                    socialsharing.shareVia(com, MaskDetail.detail.content, null, null, '', function(){
                        element.addClass('ng-hide');
                        RequestData.sudaJsonp('21_01_05_' + MaskDetail.detail.id);
                    }, function(msg) {
                        alert('分享失败')
                    });
                }               
            }
            weiboBtn.bind('touch click', function(){
                share('com.apple.social.sinaweibo')
            });
            tecentBtn.bind('touch click', function(){
                share('com.apple.social.tencentweibo')
            });
            cancelBtn.bind('touch click', function(){
                element.addClass('ng-hide');
            });
            $rootScope.$on('share_btn_touch', function(scope){
                element.removeClass('ng-hide');
            });
            element.addClass('ng-hide');
        }
    }
}]);