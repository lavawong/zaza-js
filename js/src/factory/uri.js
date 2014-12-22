mask.factory('URI', function(){
    function URI(url){
        this.parse(url);
    }

    URI.prototype = {
        constructor : URI,
        params : {},
        api : '',
        addSearch : function(param){
            for (var p in param) {
                if (param.hasOwnProperty(p)) {
                    this.params[p] = param[p];
                }
            }
            return this;
        },
        parse : function(url){
            var index = url.indexOf('?');
            var params = {};
            var api, queryStr, querys;
            
            if (index > -1) {
                var api = url.substring(0, index);
                var queryStr = url.substring(index+1);
                var querys;
                queryStr.split('&').forEach(function(val, i){
                    querys = val.split('=');
                    params[querys[0]] = querys[1] || '';
                });
            } else {
                api = url;
            }
            this.params = params;
            this.api    = api;
            return this;
        },
        toString : function(){
            var queryStr = [], params = this.params;
            for (var p in params) {
                if (params.hasOwnProperty(p)) {
                    queryStr.push(p + '=' + params[p]);
                }
            }
            return this.api + '?' + queryStr.join('&');
        }
    }
    return function(url){
        return new URI(url);
    }
});