mask.filter('changeTime', function(){
	return function(time){
		var cur = new Date().getTime();
	    var des, str, num, hour, day;
	    des = cur/1000 - time;
	    num = Math.floor(des/60);
	    if(num < 1 ){
	        str = '刚刚';
	    }else if(num >= 1 && num <60){
	        str =  num + '分钟前';
	    }else if(num >= 60 && num < (60*24)){
	        hour = Math.floor(num/60);
	        str = hour + '小时前';
	    }else if(num >= (60*24) && num < (60*24*30)){
	        day = Math.floor(num/(60*24));
	        str = day + '天前';
	    }else{
	        str = '超过30天';
	    }
	    return str;
	}
});