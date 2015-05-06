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
						// return dataService.getData(dataRoot + 'data/flows.json')
						// 	.then(function(data) {

						// 		var flowsData = {};

						// 		flowsData.all = data;
						// 		flowsData.grouped = _.groupBy(data, 'from');

						// 		console.log('THIS IS WHAT THE UNGROUPING LOOKS LIKE: ', flowsData.all);
						// 		console.log('THIS IS WHAT THE GROUPING LOOKS LIKE: ', flowsData.grouped);

						// 		return flowsData;

						// 	}, function(err) {
						// 		console.log(err);
						// 	});

						return dataService.getData(dataRoot + 'data/flows.csv')
							.then(function(data) {

								var parsedData = d3.csv.parse(data);

								var flowsData = {};


								_.each(parsedData, function(obj, key){
									obj['above normal_0'] = +obj['above normal_0'];
								})

								flowsData.all = parsedData;
								flowsData.grouped = _.groupBy(parsedData, 'from');


								_.each(flowsData.all, function(obj, key){
									/*Kathmandu, Lalitpur and Bhaktapur*/
									if(obj.from == "Lalitpur" || obj.from == "Bhaktapur"){
										if(_.findWhere(flowsData.grouped.Kathmandu, {to : obj.to})) {
											_.findWhere(flowsData.grouped.Kathmandu, {to: obj.to})['above normal_0'] += obj['above normal_0'];
										}
										else{
											flowsData.grouped.Kathmandu.push({from: "Kathmandu", to: obj.to, 'above normal_0': obj['above normal_0']})
										}
									}
								})

								_.each(flowsData.all, function(obj, key){
									/*Kathmandu, Lalitpur and Bhaktapur*/
									if(obj.to == "Lalitpur" || obj.to == "Bhaktapur"){
										if(_.findWhere(flowsData.grouped[obj.from], {to : 'Kathmandu'})) {
											_.findWhere(flowsData.grouped[obj.from], {to : 'Kathmandu'})['above normal_0'] += obj['above normal_0'];
										}
										else{
											flowsData.grouped[obj.from].push({to: "Kathmandu", from: obj.from, 'above normal_0': obj['above normal_0']})
										}
									}
								})


								console.log('THIS IS WHAT THE UNGROUPING LOOKS LIKE: ', flowsData.all);
								console.log('THIS IS WHAT THE GROUPING LOOKS LIKE: ', flowsData.grouped);

								return flowsData;

							}, function(err) {
								console.log(err);
							});
					}],
					nationData: ['dataService', function(dataService) {
						// return dataService.getData(dataRoot + 'data/nation.json')
						// 	.then(function(data) {
						// 		return data;
						// 	}, function(err) {
						// 		console.log(err);
						// 	});

						return dataService.getData(dataRoot + 'data/nation.csv')
							.then(function(data) {
								var parsedData = d3.csv.parse(data);

								_.each(parsedData, function(obj, key){
									obj['above normal_0'] = +obj['above normal_0'];
								})

								_.each(parsedData, function(obj, key){

									/*Kathmandu, Lalitpur and Bhaktapur*/
									if(obj.to == "Lalitpur" || obj.to == "Bhaktapur"){
										_.findWhere(parsedData, {to : "Kathmandu"})['above normal_0'] += obj['above normal_0'];
									}
								})



								return parsedData;
							}, function(err) {
								console.log(err);
							});
					}],
					lineChartData: ['dataService', function(dataService) {
						// return dataService.getCSV('data/lineChartData.csv')
						// 	.then(function(data) {
						// 		console.log('CSV DATA: ', data);
						// 	}, function(err) {
						// 		console.log('Errored out!');
						// 	});

						return dataService.getData(dataRoot + 'data/lineChartData.csv')
							.then(function(data) {
								// var parsedData = d3.csv.parse(data);
								// return _.groupBy(parsedData, 'Admin3');
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
