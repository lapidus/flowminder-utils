'use strict';

angular.module('flowminderUtils', [
	'ui.router'
	]);

angular.module('flowminderUtils')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

		$urlRouterProvider.otherwise('/');

		//
		// Access local data files (stored in the 'data' directory)
		//
		// var dataRoot = '/';

		//
		// Access remote data files (stored in the Flowminder-utils bucket)
		//
		var dataRoot = 'https://s3-eu-west-1.amazonaws.com/flowminder-utils/';

		$stateProvider
			.state('home', {
				url: '/',
				resolve: {
					mapData: ['dataService', function(dataService) {
						return dataService.getData(dataRoot + 'data/admin3/features.json')
							.then(function(data) {
								return data;
							}, function(err) {
								console.log(err);
							});
					}],
					flowsData: ['dataService', function(dataService) {
						return dataService.getData(dataRoot + 'data/flows.json')
							.then(function(data) {

								var flowsData = {};

								flowsData.all = data;
								flowsData.grouped = _.groupBy(data, 'from');

								return flowsData;

							}, function(err) {
								console.log(err);
							});
					}],
					nationData: ['dataService', function(dataService) {
						return dataService.getData(dataRoot + 'data/nation.json')
							.then(function(data) {
								return data;
							}, function(err) {
								console.log(err);
							});
					}],
					lineChartData: ['dataService', function(dataService) {
						return dataService.getData(dataRoot + 'data/lineChartData.json')
							.then(function(data) {
								return data;
							}, function(err) {
								console.log(err);
							});
					}]
				},
				controller: 'homeCtrl',
				templateUrl: 'home.html'
			});

	}]);
