'use strict';

angular.module('flowminderUtils')
	.directive('lineChart', [function() {

		var linker = function(scope, element, attrs) {

			console.log('Line chart directive loaded');
			console.log('The data is: ', scope.lineChart);
			console.log('The district of this line graph is: ', scope.district);

			// var districtData = _.find(scope.lineChart, function(d) {
			// 	return d[0] == scope.district;
			// });
			var districtData;
			var lineChartData = [];

			if(scope.district == 'KathmanduValley') {
				districtData = _.filter(scope.lineChart, function(d) {
					return d.Admin3 == 'Kathmandu' || d.Admin3 == 'Bhaktapur' || d.Admin3 == 'Lalitpur';
				});
				//console.log('The kathmandu valley: ', districtData);
				_.each(districtData, function(el, i) {
					var j = 0;
					_.each(el, function(v, k, l) {
						if(k != 'Admin3') {
							//console.log(j);
							var formerValue = lineChartData[j] ? lineChartData[j] : 0;
							lineChartData[j] = v ? (formerValue + parseInt(v)) : formerValue;
							j++;
						}
					});
				});
			}
			else {
				districtData = _.find(scope.lineChart, function(d) {
					return d.Admin3 == scope.district;
				});
				_.each(districtData, function(v, k, l) {
					if(k != 'Admin3') {
						lineChartData.push(v ? parseInt(v) : 0);
					}
				});
			}

			// var lineChartData = [];

			// _.each(districtData, function(v, k, l) {
			// 	if(k != 'Admin3') {
			// 		lineChartData.push(v ? parseInt(v) : 0);
			// 	}
			// });

			//console.log('The line chart data is: ', lineChartData);

			var width = 280;
			var height = 200;

			var yScale = d3.scale.linear()
										.domain([d3.min(lineChartData), d3.max(lineChartData)])
										.range([60, (height - 60)]);

			var svg = d3.select(element[0])
								.append('svg')
								//.attr('class', 'export')
								.attr('id', function (){
								    return scope.district;
								})

								.attr('width', width)
								.attr('height', height)
								.append('g')
									.attr('transform', 'translate(20, 0)');

			var line = d3.svg.line()
					.x(function(d, i) {
						var factor = (width - 40) / (lineChartData.length - 1);
						return i * factor;
					})
					.y(function(d) {
						return height - yScale(d);
					})


			svg.append('path')
					.datum(lineChartData)
					.attr('class', 'line')
					.attr('d', line);

			// svg.append('text')
			// 		.attr('x', 0)
			// 		.attr('y', (scope.district == 'Rasuwa') ? (height - yScale(lineChartData[0]) - 30) : (height - yScale(lineChartData[0]) + 20) )
			// 		.text(d3.format(',f')(lineChartData[0]));

			// svg.append('text')
			// 		.attr('x', (width - 95))
			// 		.attr('y', (scope.district == 'Kathmandu' || scope.district == 'KathmanduValley') ? (height - yScale(lineChartData[lineChartData.length - 1]) - 25) : (height - yScale(lineChartData[lineChartData.length - 1]) - 10) )
			// 		.text(d3.format(',f')(lineChartData[lineChartData.length - 1]));

			svg.append('text')
					.attr('x', 0)
					.attr('y', (height - 5))
					.text(d3.format(',f')(lineChartData[0]));

			svg.append('text')
					.attr('x', (width - 95))
					.attr('y', 20 )
					.text(d3.format(',f')(lineChartData[lineChartData.length - 1]));

		};

		return {
			name: 'lineChart',
			scope: {
				'lineChart': '=',
				'district': '='
			},
			restrict: 'A',
			template: '<h2>{{ district == "KathmanduValley" ? "Kathmandu Valley" : district }}</h2>',
			link: linker
		};
	}]);
