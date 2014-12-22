mask.filter('limitCharacters', ['byteLength', function(byteLength){
    return function(input, length){
        // return length - Math.ceil(byteLength(input)/2);
        if(typeof input == 'undefined'){
        	return length;
        }else {
        	return length - input.length;
        }
        
    }
}]);