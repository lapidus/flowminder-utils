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

		// this.getCSV = function(url) {
		// 	var deferred = $q.defer();

		// 	d3.csv(url, function(err, d) {
		// 		if(err) {
		// 			deferred.reject();
		// 		}
		// 		else {
		// 			deferred.resolve(d);
		// 		}
		// 	});

		// 	return deferred.promise;
		// };
	}]);
