mask.factory('httpRequestInterceptor', ['UserData', 'URI', function (UserData, URI) {
  return {
    request: function (config) {
      var sessionId = UserData.data.session_id;
      if (sessionId) {
        config.url =  URI(config.url).addSearch({'session_id':sessionId}).toString();
      }
      return config;
    }
  };
}]);