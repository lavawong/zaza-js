mask.service('byteLength', function(){

    var UNICODE_REGEXP = /[^\x00-\x80]/g;

    var byteLength = function(str){
        if(typeof str == "undefined"){
            return 0;
        }
        var aMatch = str.match(/[^\x00-\x80]/g);
        return (str.length + (!aMatch ? 0 : aMatch.length));
    };
    return byteLength;
});