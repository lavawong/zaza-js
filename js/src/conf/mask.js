var mask = angular.module('mask', ['ngRoute', 'ngTouch', 'ngAnimate'], ['$httpProvider',
    function ($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] =
            'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '',
                name, value, fullSubName, subName, subValue,
                innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' +
                    encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) :
                query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [
            function (data) {
                return angular.isObject(data) && String(data) !==
                    '[object File]' ? param(data) : data;
            }
        ];
    }
]);

// session id
mask.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);

// session id
mask.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $location) {
    
    $routeProvider.when('/home', {
        templateUrl: 'home.html'

    }).when('/home/:homeTab', {
        templateUrl: 'home.html'

    }).when('/addCmt', {
        templateUrl: 'addCmt.html'

    }).when('/detail/:id', {
        controller: 'MaskDetailCtrl',
        controllerAs: 'detail',
        templateUrl: 'detail.html'

    }).when('/hotList/:name', {
        controller: 'HotListCtrl',
        controllerAs: 'list',
        templateUrl: 'hotListTpl.html'

    }).when('/write', {
        templateUrl: 'write.html'

    }).when('/more', {
        templateUrl: 'more.html'

    }).when('/updateNick', {
        templateUrl: 'updateNick.html'

    }).when('/myList', {
        templateUrl: 'myList.html'

    }).when('/myReply', {
        templateUrl: 'myReply.html'

    }).otherwise({
        redirectTo: '/home'
    });
    //$locationProvider.html5Mode(true);
}]);

function log(){
    if (!arguments.length) {
        return
    }
    var msgArr = [];
    var log = document.getElementById('log');
    var el = document.createElement('p');
    var val;
    for (var i =0, len = arguments.length ; i < len; i++) {
        val = arguments[i];
        if ('object' === typeof val) {
            msgArr.push(JSON.stringify(val));
        } else {
            msgArr.push(val);
        }
    }
    el.textContent = msgArr.join(', ');
    log.appendChild(el);
}


