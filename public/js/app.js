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
						return dataService.getData('data/nepal/shapes/admin3.json')
							.then(function(data) {
								return data;
							}, function(err) {
								console.log(err);
							});
					}],
					admin4: ['dataService', function(dataService) {
						return dataService.getData('data/nepal/shapes/admin4.json')
							.then(function(data) {
								return data;
							}, function(err) {
								console.log(err);
							});
					}],

					admin4Data: ['dataService', function(dataService) {
						return dataService.getData(dataRoot + 'data/nation_admin4.csv')
							.then(function(data) {
								var parsedData = d3.csv.parse(data);

								_.each(parsedData, function(obj, key){
									obj['value'] = +obj['value'];
								})

								return parsedData;
							}, function(err) {
								console.log(err);
							});
					}],


					flowsData: ['dataService', function(dataService) {

						return dataService.getData(dataRoot + 'data/flows.csv')
							.then(function(data) {

								var parsedData = d3.csv.parse(data);

								var flowsData = {};


								_.each(parsedData, function(obj, key){
									obj['value'] = +obj['value'];
								})

								flowsData.all = parsedData;
								flowsData.grouped = _.groupBy(parsedData, 'from');

								//console.log('THIS IS WHAT THE UNGROUPING LOOKS LIKE: ', flowsData.all);
								//console.log('THIS IS WHAT THE GROUPING LOOKS LIKE: ', flowsData.grouped);

								return flowsData;

							}, function(err) {
								console.log(err);
							});
					}],
					nationData: ['dataService', function(dataService) {


						return dataService.getData(dataRoot + 'data/inflows.csv')
							.then(function(data) {
								var parsedData = d3.csv.parse(data);

								_.each(parsedData, function(obj, key){
									obj['value'] = +obj['value'];
								})



								return parsedData;
							}, function(err) {
								console.log(err);
							});
					}],
					lineChartData: ['dataService', function(dataService) {

						return dataService.getData(dataRoot + 'data/lineChartData.csv')
							.then(function(data) {

								var parsedData = d3.csv.parse(data);
								return parsedData;
							}, function(err) {
								console.log(err);
							});
					}]
				},
				controller: 'homeCtrl',
				templateUrl: 'home.html'
			});

	}]);
