'use strict';

angular.module('flowminderUtils')
	.service('dataService', ['$q', '$http', function($q, $http) {
		this.getData = function(url) {
			var deferred = $q.defer();

			$http.get(url)
				.success(deferred.resolve)
				.error(deferred.reject);

			return deferred.promise;
		};
	}]);
