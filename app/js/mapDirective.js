'use strict';

angular.module('flowminderUtils')
	.directive('map', [function() {

		var linker = function(scope, element, attrs) {
			console.log('Map directive loaded');

			scope.map.then(function(nepal) {

				console.log('Nepal: ', nepal);

				var width = 940;
				var height = 460;

				var svg = d3.select(element[0])
										.append('svg')
										.attr('width', width)
										.attr('height', height);

				var projection = d3.geo.mercator()
													.scale(3000)
													.center([85, 28])
													.translate([width / 2, height / 2]);

				var path = d3.geo.path().projection(projection);

				var subunits = topojson.feature(nepal, nepal.objects.features);

				svg.selectAll('.subunit')
						.data(subunits.features)
						.enter()
						.append('path')
						.attr('d', path)
						.attr('class', function(d, i) { return 'subunit ' + d.properties.DISTRICT; });

				//
				// Load district data
				//
				scope.districts.then(function(bubbleData) {

					console.log('Bubble data: ', bubbleData);

					var bubbleMax = _.max(bubbleData, function(item) {
						return item.value;
					});
					var bubbleMin = _.min(bubbleData, function(item) {
						return item.value;
					});

					console.log('BubbleMin: ', bubbleMin);
					console.log('BubbleMax: ', bubbleMax);

					var colors = d3.scale.linear()
											.domain([bubbleMin.value, bubbleMax.value])
											.range(['#00569A', '#B71C1C']);

					svg.append('g')
							.attr('class', 'bubbles')
							.selectAll('bubble')
								.data(subunits.features)
									.enter()
									.append('circle')
									.attr('class', function(d) {
										return 'bubble ' + 'bubble_' + d.properties.DISTRICT;
									})
									.style('fill', function(d) {
										var item = _.find(bubbleData, function(item) {
											return item.to == d.properties.DISTRICT;
										});
										return colors(item.value);
									})
									.attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; })
									.attr('r', function(d) {

										var bubbleItem = _.find(bubbleData, function(item) {
											return item.to == d.properties.DISTRICT;
										});

										console.log('Bubble Item: ', bubbleItem);

										if(bubbleItem) {
											var adjustedSize = Math.abs(bubbleItem.value) * 0.00006;
											if(adjustedSize < 2) {
												return 2;
											}
											else {
												return adjustedSize;
											}
										}
										else {
											return 3;
										}
									});

				});

			});

		};

		return {
			name: 'map',
			scope: {
				'map': '=',
				'districts': '='
			},
			restrict: 'A',
			template: '<h1>Map directive</h1>',
			// templateUrl: '',
			link: linker
		};
	}]);
