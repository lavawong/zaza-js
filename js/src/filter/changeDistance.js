mask.filter('changeDistance', function(){
	return function(dis){
		var str = '';
		if(dis < 100){
			str = '<100m';
		}else if(dis >= 100 && dis < 500){
			str = '<500m';
		}else if(dis >= 500 && dis < 1000){
			str = '<1km';
		}else if(dis >= 1000 && dis < 2000){
			str = '<2km';
		}else{
			str = '>2km';
		}
		return str;
	}
});