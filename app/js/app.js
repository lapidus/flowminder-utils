'use strict';

angular.module('flowminderUtils', []);

angular.module('flowminderUtils')
	.controller('mainCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {

		console.log('Main controller loaded.');


		$scope.distance = 0;

		$scope.model = {
			districts : ["Kathmandu", "Gorkha", "Dhading", "Nuwakot", "Rasuwa", "Sindhupalchok"],
			districtsData : {},
		};

		var deferredMap = $q.defer();

		$http.get('data/admin3/features.json')
			.success(deferredMap.resolve)
			.error(deferredMap.reject);

		$scope.mapPromise = deferredMap.promise;

		$scope.mapPromise.then(function(m) {
			$scope.model.map = m;
		});


		var deferredData = $q.defer();
		$http.get('data/flows.json')
			.success(deferredData.resolve)
			.error(deferredData.reject);

		$scope.dataPromise = deferredData.promise;

		$scope.dataPromise.then(function(d) {
			$scope.model.allData = d;
			$scope.model.districtsData = _.groupBy(d, 'from');
		});

		var deferredData = $q.defer();
		$http.get('data/nation.json')
			.success(deferredData.resolve)
			.error(deferredData.reject);

		$scope.dataPromise = deferredData.promise;

		$scope.dataPromise.then(function(d) {
			$scope.model['nation'] = d;
		});

	}]);
