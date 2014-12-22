mask.filter('outOfLimit', ['byteLength', function(byteLength){
    return function(input, length){
        // return Math.ceil(byteLength(input)/2) - length;
        if(typeof input == 'undefined'){
        	return length;
        }else {
        	return input.length - length;
        }
        
    }
}]);