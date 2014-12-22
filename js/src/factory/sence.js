mask.factory('Sence', function(){
    var defaultPage = 'home';
    var path = [defaultPage];
    return {
        currentPage: defaultPage,        
        changePage: function(page){
            // // console.log('changePage', page, path, path.length);
            if (path.length > 1 && (page === path[path.length - 2]) ) {
                path.pop();
            } else {
                path.push(page);
            }
            this.currentPage = page;
            
        },
        back: function(){
            // // console.log('back', path);
            path.pop();
            if (path.length > 0) {
                this.currentPage = path[path.length-1];
            } else {
                this.currentPage = defaultPage;
                path.push(defaultPage);
            }
        }
    }
});