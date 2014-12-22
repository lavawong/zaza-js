mask.factory('Recomment', function(){
    return {
        type  : '', // 推荐类型 place: 地点 | topic: 话题
        id : '', // 推荐内容的id
        value : '',
        change : function(type, id, value){
            this.type = type;
            this.id   = id;
            this.value = value
        }
    }
});