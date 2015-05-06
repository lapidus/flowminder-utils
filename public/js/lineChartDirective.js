'use strict';

angular.module('flowminderUtils')
	.directive('lineChart', [function() {

		var linker = function(scope, element, attrs) {

			console.log('Line chart directive loaded');
			console.log('The data is: ', scope.lineChart);
			console.log('The district of this line graph is: ', scope.district);

			var districtData = _.find(scope.lineChart, function(d) {
				return d[0] == scope.district;
			});

			var lineChartData = districtData[1];
			console.log('The line chart data is: ', lineChartData);
			var linedata = [5, 1, 2, 5, 7, 3, 6];

			var width = 280;
			var height = 160;

			var yScale = d3.scale.linear()
										.domain([d3.min(lineChartData), d3.max(lineChartData)])
										.range([40, (height - 40)]);

			var svg = d3.select(element[0])
								.append('svg')
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

			svg.append('text')
					.attr('x', 0)
					.attr('y', (scope.district == 'Rasuwa') ? (height - yScale(lineChartData[0]) - 30) : (height - yScale(lineChartData[0]) + 20) )
					.text(d3.format(',f')(lineChartData[0]));

			svg.append('text')
					.attr('x', (width - 80))
					.attr('y', (scope.district == 'Kathmandu') ? (height - yScale(lineChartData[lineChartData.length - 1]) - 25) : (height - yScale(lineChartData[lineChartData.length - 1]) - 10) )
					.text(d3.format(',f')(lineChartData[lineChartData.length - 1]));

		};

		return {
			name: 'lineChart',
			scope: {
				'lineChart': '=',
				'district': '='
			},
			restrict: 'A',
			template: '<h2>{{ district }}</h2>',
			link: linker
		};
	}]);
