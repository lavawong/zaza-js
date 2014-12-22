/* mask信息列表标记服务 */
mask.factory('MaskListType', function(){
    return {
        // 1. latest 最新 
        // 2. hottest 最热
        // 3. mine 我的
        currentType: 1,
        /* 更改当前信息列表 */
        changeType: function(type){
            this.currentType = type;
        } 
    }
});