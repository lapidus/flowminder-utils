'use strict';

angular.module('flowminderUtils')
	.controller('homeCtrl', ['$scope', 'mapData', 'flowsData', 'nationData', 'lineChartData', function($scope, mapData, flowsData, nationData, lineChartData) {

		console.log('Home controller loaded.');

		console.log('mapData: ', mapData);
		console.log('flowsData: ', flowsData);
		console.log('nationData: ', nationData);
		console.log('lineChartData: ', lineChartData);

		$scope.distance = 0;
		$scope.factor = 9.97;

		$scope.model = {
			districts: ['Kathmandu', 'Gorkha', 'Dhading', 'Nuwakot', 'Rasuwa', 'Sindhupalchok'],
			districtsData: {}
		};

		$scope.model.map = mapData;
		$scope.model.allData = flowsData.all;
		$scope.model.districtsData = flowsData.grouped;
		$scope.model['nation'] = nationData;

		$scope.model.lineChartData = lineChartData;

		// var deferredMap = $q.defer();

		// $http.get('data/admin3/features.json')
		// 	.success(deferredMap.resolve)
		// 	.error(deferredMap.reject);

		// $scope.mapPromise = deferredMap.promise;

		// $scope.mapPromise.then(function(m) {
		// 	$scope.model.map = m;
		// });

		// var deferredData = $q.defer();
		// $http.get('data/flows.json')
		// 	.success(deferredData.resolve)
		// 	.error(deferredData.reject);

		// $scope.dataPromise = deferredData.promise;

		// $scope.dataPromise.then(function(d) {
		// 	$scope.model.allData = d;
		// 	$scope.model.districtsData = _.groupBy(d, 'from');
		// });

		// var deferredData = $q.defer();
		// $http.get('data/nation.json')
		// 	.success(deferredData.resolve)
		// 	.error(deferredData.reject);

		// $scope.dataPromise = deferredData.promise;

		// $scope.dataPromise.then(function(d) {
		// 	$scope.model['nation'] = d;
		// });

	}]);
