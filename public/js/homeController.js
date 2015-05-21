'use strict';

angular.module('flowminderUtils')
	.controller('homeCtrl', ['$scope', 'mapData', 'flowsData', 'nationData', 'lineChartData', '$http', function($scope, mapData, flowsData, nationData, lineChartData, $http) {

		console.log('Home controller loaded.');

		console.log('mapData: ', mapData);
		console.log('flowsData: ', flowsData);
		console.log('nationData: ', nationData);
		console.log('lineChartData: ', lineChartData);



		$scope.distance = 0;
		$scope.factor = 1;

		$scope.model = {
			districts: [
				'Kathmandu',
				'Dhading',
				'Dolakha',
				'Gorkha',
				'Kabhrepalanchok',
				'Makawanpur',
				'Nuwakot',
				'Okhaldhunga',
				'Ramechhap',
				'Rasuwa',
				'Sindhupalchok'
			],
			districtsData: {}
		};

		$scope.model.map = mapData;
		$scope.model.allData = flowsData.all;
		$scope.model.districtsData = flowsData.grouped;
		$scope.model['nation'] = nationData;

		$scope.model.lineChartData = lineChartData;


		$scope.exportChart = function (format) {

			console.log("Exporting");


			d3.selectAll('.export').each(function (){
				var chart = d3.select(this),
					serializedChart = (new XMLSerializer()).serializeToString(chart.node());

				console.log("se");

				var params = {
					content: serializedChart,
					format: 'png',
					filename : d3.select(this).attr('id')
				};

				console.log("p", params);

					$scope.saving = 0;


					$http.post('./export', params).
					success(function(filePath, status, headers, config) {


							$scope.saving += 1;
						console.log("Success");

						//window.location.href = apiExportBaseUrl + filePath;
					}).
					error(function(data, status, headers, config) {
						console.log('EXPORT FAIL', data.message);
					});


			})

			/*var parent = element.parents('.bubble-chart-holder'),
			 chart = d3.select(parent[0]).select('svg.chart'),
			 serializedChart = (new XMLSerializer()).serializeToString(chart.node());

			 dataService.exportChart(serializedChart, format);*/
		}


		/**
		 * Simple setup for exporting the charts
		 * @param  {String} chart Serialized chart source
		 * @param  {String} format What to export, .png, .svg, .pdf
		 * @return {[type]}       [description]
		 */
		/*function exportChart (chart, format) {

		};*/





	}]);
