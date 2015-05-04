'use strict';

angular.module('flowminderUtils')
	.directive('map', [function() {

		var linker = function(scope, element, attrs) {
			console.log('Map directive loaded');

			d3.json('data/features.json', function(err, nepal) {
				if (err) {
					return console.error(err);
				}
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
						.data(topojson.feature(nepal, nepal.objects.features).features)
						.enter()
						.append('path')
						.attr('d', path)
						.attr('class', function(d, i) { return 'subunit ' + d.properties.ZONE_NAME; });

				d3.csv('data/data.csv', function(err, bubbleData) {

					var bubbleMax = _.max(bubbleData, function(item) {
						return item.SUM;
					});
					var bubbleMin = _.min(bubbleData, function(item) {
						return item.SUM;
					});

					var colors = d3.scale.linear()
											.domain([bubbleMin.SUM, bubbleMax.SUM])
											.range(['#00569A', '#B71C1C']);

					console.log('Bubble data: ', bubbleData);

					svg.append('g')
							.attr('class', 'bubbles')
							.selectAll('bubble')
								.data(topojson.feature(nepal, nepal.objects.features).features)
									.enter()
									.append('circle')
									.attr('class', function(d) {
										return 'bubble ' + 'bubble_' + d.properties.ZONE_NAME;
									})
									.style('fill', function(d) {
										var item = _.find(bubbleData, function(item) {
											return item.ZONE_NAME == d.properties.ZONE_NAME;
										});
										return colors(item.SUM);
									})
									.attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; })
									.attr('r', function(d) {

										var bubbleItem = _.find(bubbleData, function(item) {
											return item.ZONE_NAME == d.properties.ZONE_NAME;
										});

										console.log('Bubble Item: ', bubbleItem);

										if(bubbleItem) {
											var adjustedSize = Math.abs(bubbleItem.SUM) / 400;
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
				'map': '='
			},
			restrict: 'A',
			template: '<h1>Map directive</h1>',
			// templateUrl: '',
			link: linker
		};
	}]);
