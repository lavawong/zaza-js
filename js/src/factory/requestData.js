/* 各种请求服务 */
mask.factory('RequestData', ['$http', '$q','Map', 'API',function($http, $q, Map, API){
	// var deferred = $q.defer();
	return {
		
		// 发表对秘密的态度（顶，踩）
		addSecretAtt : function(id , type){
			var deferred = $q.defer();
			var postData = {
				secretid : id,
				attitude : type
			};
			
			// // console.log(postData);
			$http({
				method : 'POST',
				url : API.ADD_SECRET_ATT,
				data : postData
			}).success(function(result, status, headers, config){
				// // console.log('suc: ',result);
				if(result.code == 'A00006'){
					deferred.resolve(result.message);
				}else{
					deferred.reject(result);
				}
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				// deferred.reject(result);
			});
			return deferred.promise;
		},			
		// 发表对评论的态度（顶，踩）
		addCmtAtt : function(id , type){
			var deferred = $q.defer();
			var postData = {
				cmtid : id,
				attitude : type
			};
			// // console.log(postData);
			$http({
				method : 'POST',
				url : API.ADD_CMT_ATT,
				data : postData
			}).success(function(result, status, headers, config){
				// // console.log('suc: ',result);
				if(result.code == 'A00006'){
					deferred.resolve(result.message);
				}else{
					deferred.reject(result);
				}
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				// deferred.reject(result);
			});
			return deferred.promise;
		},			
		// 请求数据封装promise方法
		loadData : function(httpData){
			var deferred = $q.defer();
			$http(httpData).success(function(result, status, headers, config){
				// // console.log('suc: ',result);
				if(result.code == 'A00006' || result.code == 'A00008'){				
					deferred.resolve(result);
				}else{
					deferred.reject(result);
				}
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				// deferred.reject(result);
			});
			return deferred.promise;
		},
		// 用于布码的jsonp请求
		sudaJsonp : function(code){
			var deferred = $q.defer();
			var config = {
				params : {
					type : code,
					callback : 'JSON_CALLBACK'
				}
			}
			$http.jsonp(API.SUDA_URL, config).success(function(result, status, headers, config){
				// // console.log('suc: ',result);		
				deferred.resolve(result);
			}).error(function(result, status, headers, config){
				// // console.log('err: ',result);
				deferred.reject(result);
			});
			return deferred.promise;
		}
	}
}]);