mask.factory('ListData', function(){
	return {
		lists : [],
		replys : [],
        findMask: function(id){
            var mask, tmp;
            for (var i = 0; i < this.lists.length; i++) {
                tmp = this.lists[i];
                if (tmp.id == id) {
                    mask = tmp;
                    break;
                }
                
            }
            return mask;
        }
	}
});