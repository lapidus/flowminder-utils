'use strict';

angular.module('flowminderUtils')
	.directive('map', [function() {

		var linker = function(scope, element, attrs) {
			console.log('Map directive loaded');

			var nepal = scope.map;

			// scope.map.then(function(nepal) {

				console.log('Nepal: ', nepal);

				var width = 940;
				var height = 460;

				var svg = d3.select(element[0])
								.append('svg')
								.attr('width', width)
								.attr('height', height);

				var projection = d3.geo.mercator()
								.scale(5000)
								.center([85, 28.2])
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
				// Wait for district data to load
				//
				// scope.$watch('data', function (){
				// 	render();
				// });

				scope.$watch('distance', function (){
					render();
				});

				var container = svg.append('g')
					.attr('class', 'bubbles');

				var legend = svg.append('g')
					.attr('class', 'legend');

				var districtFeature = _.filter(subunits.features, function (d) {
					return d.properties.DISTRICT == scope.district;
				})[0];

				console.log('dd', districtFeature);

				if(scope.district != "Overall") {
					var pin = svg.append('g')
						.attr('class', 'pin')
						.attr('transform', function (d) {
							return 'translate(' + path.centroid(districtFeature) + ')';
						})
						.append('circle')
						.attr('r', 20)
						.attr('stroke', 'green')
				}

				function render() {

					if(!scope.data) return;

					var valueColumn = 'above normal_' + scope.distance;

					_.each(subunits.features, function(obj, key){

						// obj.value = _.findWhere(scope.data, {'to': obj.properties.DISTRICT })[valueColumn];

						obj.value = _.findWhere(scope.data, { 'to': obj.properties.DISTRICT })[valueColumn]*3.24;

						if(obj.value < 0){
							obj.negative = true;
						}

					});

					subunits.features = subunits.features.sort(function (a, b){
						return Math.abs(b.value) - Math.abs(a.value);
					});

					console.log('read', subunits.features);

					var bubbleMax = _.max(subunits.features, function(item) {
						return Math.abs(item.value);
					});
					var bubbleMin = _.min(subunits.features, function(item) {
						return Math.abs(item.value);
					});


					console.log('BubbleMin: ', bubbleMin);
					console.log('BubbleMax: ', bubbleMax);

					var colorScale = d3.scale.sqrt()
						.domain([bubbleMin.value, bubbleMax.value])
						.range(['#00569A', '#B71C1C']);
					// .range(['#00569a', 'rgba(183, 28, 28, 0.5)']);
                    //

					var values = [3000, 9000, 30000, 90000];

					if(scope.district == 'Kathmandu'){
						var radiusScale = d3.scale.sqrt()
							.domain([0, 90000]) //.domain([Math.abs(bubbleMin.value), Math.abs(bubbleMax.value)])
							.range([0, 38]);
					}
					else if(scope.district == 'Overall'){
						var radiusScale = d3.scale.sqrt()
							.domain([0, 400000]) //.domain([Math.abs(bubbleMin.value), Math.abs(bubbleMax.value)])
							.range([0, 38]);
						values = [20000, 50000, 100000, 200000];
					}
					else{
						var radiusScale = d3.scale.sqrt()
							.domain([0, 6000]) //.domain([Math.abs(bubbleMin.value), Math.abs(bubbleMax.value)])
							.range([0, 38]);
						values = [300, 1500, 3000, 6000];
					}

					// var opacityScale = d3.scale.linear()
					// 										.domain([bubbleMin.value, bubbleMax.value])
					// 										.range([1, 0.6]);



					var legendBubbles = legend.selectAll('.bubble').data(values);

					var y = 0;

					legendBubbles.enter()
						.append('circle')
						.style('fill', function(d) {
							return '#fff'; d.negative ? '#00569a' : '#BF360C'; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('stroke', function(d) {
							return '#666';  //colorScale(item.value);
						})
						.attr('transform', function(d, i) {
							y += radiusScale(d) + radiusScale(d)/2;
							return 'translate(' + (600) + ',' + (50 + y)  +')';
						})
						.attr('r', function(d,i) {
							var value = d;
							return radiusScale(Math.abs(value));
						});

					var y = 0;

					legendBubbles.enter()
						.append('text')
						.style('fill', function(d) {
							return '#333';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('font-size', function(d) {
							return '12px';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('font-family', function(d) {
							return 'Droid Sans, Helvetica, sans-serif';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.attr('x', function(d, i) {
							return 600 + radiusScale(d) + 5;
						})
						.attr('y', function(d, i) {
							y += radiusScale(d) + radiusScale(d)/2;
							return (50 + y + 5);
						})
						/*.style('stroke', function(d) {
							return "#666";  //colorScale(item.value);
						})*/
						.html(function (d){
							return d3.format(',f')(d);
						});

					/*legendBubbles.enter()
						.
						.attr('r', function(d,i) {
							var value = d;
							return radiusScale(Math.abs(value));
						});*/

					var bubbles = container.selectAll('.bubble')
						.data(subunits.features, function (d){
							return d.properties.DISTRICT;
						});

					bubbles.enter()
						.append('circle');

					bubbles.transition()
						// .attr('fill-opacity', function(d) {
						// 	var item = _.find(bubbleData, function(item) {
						// 		return item.to == d.properties.DISTRICT;
						// 	});
						// 	return opacityScale(item.value);
						// })
						.attr('fill-opacity', 0.8)
						.attr('class', function(d) {
							return 'bubble ' + 'bubble_' + d.properties.DISTRICT;
						})
						.style('fill', function(d) {
							var item = d.properties.DISTRICT;

							//return '#00569a'; //colorScale(item.value); //"#00569a";  //colorScale(item.value);

							return d.negative ? '#00569a' : '#BF360C'; //colorScale(item.value); //"#00569a";  //colorScale(item.value);


						})
						.style('stroke', function(d) {
							return '#fff';  //colorScale(item.value);
						})
						.attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; })
						.attr('r', function(d) {

							//console.log('Bubble Item: ', bubbleItem);
							return radiusScale(Math.abs(d.value));
						});

					bubbles.exit().remove()

						.attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; });

				}

			// });
			// render();

		};

		return {
			name: 'map',
			scope: {
				'map': '=',
				'districts': '=',
				'district': '=',
				'data': '=',
				'distance': '='
			},
			restrict: 'A',
			templateUrl: 'map.html',
			// templateUrl: '',
			link: linker
		};
	}]);
