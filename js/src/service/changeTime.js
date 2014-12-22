mask.service('changeTime', function(){
  return function (data){
    if (!data) {
      return [];
    }
    var cur = new Date().getTime();   
    for(var i = 0; i <data.length; i++){
      var des = cur - data[i].publishTime;
      var num = Math.floor(des/(1000*60));
      var str = num +'分钟前';
      data[i].passTime = str;
    }
    return data;
  }
});