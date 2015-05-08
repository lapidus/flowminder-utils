'use strict';

angular.module('flowminderUtils')
	.directive('map', [function() {

		var linker = function(scope, element, attrs) {
			console.log('Map directive loaded');

			//
			// Add logos
			//
			d3.select(element[0])
				.append('img')
				.attr('src', 'img/world-pop.jpg')
				.attr('class', 'logo-worldpop');

			d3.select(element[0])
				.append('img')
				.attr('src', 'img/flowminder.png')
				.attr('class', 'logo-flowminder');

			var nepal = scope.map;

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
					.attr('fill', function (){
						if(scope.district == 'Overall'){
							return '#f2f2f2';
						}
						else{
							return '#e2e2e2'
						}
					})

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

				scope.$watch('factor', function (){
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

				if(scope.district != 'Overall') {
					var pin = svg.append('g')
						.attr('class', 'pin')
						.attr('transform', function (d) {
							var centroid = path.centroid(districtFeature);
							// return 'translate(' + path.centroid(districtFeature) + ')';
							return 'translate(' + (centroid[0] - 24) + ', ' + (centroid[1] - 48) + ')';
						});

					//
					// Fat pin
					//

					// pin.append('path')
					// 	.attr('class', 'pin-hole')
					// 	.attr('d', 'M28 16c0 2.209-1.791 4-4 4s-4-1.791-4-4c0-2.209 1.791-4 4-4s4 1.791 4 4z');
					// pin.append('path')
					// 	.attr('class', 'pin-marker')
					// 	.attr('d', 'M24 0c-11.214 0-20 8.86-20 20.168 0 17.582 18.75 27.316 19.546 27.722 0.142 0.074 0.298 0.11 0.454 0.11s0.31-0.036 0.454-0.11c0.798-0.406 19.546-10.14 19.546-27.722 0-11.308-8.786-20.168-20-20.168zM24 22c-3.308 0-6-2.692-6-6s2.692-6 6-6c3.308 0 6 2.692 6 6s-2.692 6-6 6z');

					//
					// Skinny pin
					//

					pin.append('path')
						.attr('class', 'pin-hole')
						.attr('d', 'M28 14.834c0 2.209-1.791 4-4 4s-4-1.791-4-4c0-2.209 1.791-4 4-4s4 1.791 4 4z');
					pin.append('path')
						.attr('class', 'pin-marker')
						.attr('d', 'M24-0.166c-9.376 0-17 7.626-17 17 0 5.992 3.63 10.424 6.362 13.234 4.528 4.664 9.596 15.582 9.636 17.098 0 0.552 0.448 1 1 1 0.538 0 0.976-0.424 1-0.956v-0.006c0-0.002 0-0.002 0-0.002v0-0.002c0 0 0-0.002 0-0.004v0-0.002c0-0.002 0-0.002 0-0.002v0-0.006c0-0.002 0-0.002 0-0.002v-0.020c0-1.476 3.004-11.606 8.638-16.336 4.816-4.042 7.364-8.882 7.364-13.996 0-9.374-7.624-16.998-17-16.998zM24 20.834c-3.308 0-6-2.692-6-6s2.692-6 6-6 6 2.692 6 6-2.692 6-6 6z');


					//
					// Pin with base
					//

					/*pin.append('path')
						.attr('class', 'pin-hole')
						.attr('d', 'M23.998 9.534c-3.088 0-5.6 2.514-5.6 5.6 0 3.088 2.512 5.604 5.6 5.604s5.6-2.516 5.6-5.604c0-3.086-2.512-5.6-5.6-5.6z');
					pin.append('path')
						.attr('class', 'pin-marker')
						.attr('d', 'M23.998 0.008c-9.814 0-17.5 7.76-17.5 17.666 0 15.368 16.35 23.872 17.046 24.224 0.142 0.070 0.298 0.11 0.454 0.11s0.312-0.040 0.454-0.11c0.696-0.356 17.046-8.856 17.046-24.224 0-9.906-7.686-17.666-17.5-17.666zM23.998 22.736c-4.19 0-7.6-3.41-7.6-7.604 0-4.192 3.41-7.6 7.6-7.6s7.6 3.408 7.6 7.6c0 4.194-3.41 7.604-7.6 7.604z');
					pin.append('path')
						.attr('class', 'pin-marker')
						.attr('d', 'M35.040 36.402c-4.544 4.598-9.296 7.086-9.676 7.282-0.422 0.21-0.892 0.324-1.364 0.324-0.468 0-0.94-0.114-1.358-0.324-0.382-0.196-5.138-2.684-9.684-7.286-5.576 0.664-12.958 2.168-12.958 5.484 0 4.832 15.702 6.11 24 6.11 8.3 0 24-1.278 24-6.11-0.002-3.304-7.514-4.816-12.96-5.48z');
*/
				}

				function render() {

					if(!scope.data) return;

					var valueColumn = 'above normal_' + scope.distance;

					_.each(subunits.features, function(obj, key){

						// obj.value = _.findWhere(scope.data, {'to': obj.properties.DISTRICT })[valueColumn];

						obj.value = _.result(_.findWhere(scope.data, { 'to': obj.properties.DISTRICT }), valueColumn, '0')*scope.factor;

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



					var posBubbles = legend.selectAll('.posBubble')
						.data(["Negative", "Positive"]);

					posBubbles.enter()
						.append('circle')
						.attr("class", "posBubble")
						.style('fill', function(d) {

							if(scope.district == 'Overall'){
								return d == 'Negative' ? d3.rgb('#00569a').darker(0.4) : d3.rgb('#BF360C').darker(0.4);
							}

							return d == 'Negative' ? '#00569a' : '#BF360C';

							//return d == 'Negative' ? '#00569a' : '#BF360C'; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('fill-opacity', function(d) {
							return 0.7; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('stroke', function(d) {
							return '#666';  //colorScale(item.value);
						})
						.attr('transform', function(d, i) {
							return 'translate(' + (600 + 100*i) + ',' + (30)  +')';
						})
						.attr('r', function(d,i) {
							return 10;
						});

					posBubbles.enter()
						.append('text')
						.style('fill', function(d) {
							return '#333';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('font-size', function(d) {
							return '16px';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.style('font-family', function(d) {
							return 'Droid Sans, Helvetica, sans-serif';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
						})
						.attr('x', function(d, i) {
							return (600 + 100*i) +15;
						})
						.attr('y', function(d, i) {
							return (36);
						})
						.html(function (d){
							return d;
						});



					var legendBubbles = legend.selectAll('.bubble').data(values);

					var y = 0;

					legendBubbles.enter()
						.append('circle')
						.style('fill', function(d) {
							return '#fff'; //d.negative ? '#00569a' : '#BF360C'; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
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
							return '16px';  //d.negative ? "#00569a" : "#BF360C"; //colorScale(item.value); //"#00569a";  //colorScale(item.value);
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

					var featuresToDraw = _.filter(subunits.features, function (d){
					    return d.properties.DISTRICT != "Lalitpur" && d.properties.DISTRICT != "Bhaktapur";
					})

					if(scope.district == "Kathmandu"){
						featuresToDraw = _.filter(subunits.features, function (d){
							return d.properties.DISTRICT != "Lalitpur" && d.properties.DISTRICT != "Bhaktapur" && d.properties.DISTRICT != "Kathmandu" ;
						})
					}


					var bubbles = container.selectAll('.bubble')
						.data(featuresToDraw, function (d){
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
							if(scope.district == 'Overall'){
								return d.negative ? d3.rgb('#00569a').darker(0.4) : d3.rgb('#BF360C').darker(0.4);
							}

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

		};

		return {
			name: 'map',
			scope: {
				'map': '=',
				'districts': '=',
				'district': '=',
				'data': '=',
				'distance': '=',
				'factor' : '='
			},
			restrict: 'A',
			templateUrl: 'map.html',
			// templateUrl: '',
			link: linker
		};
	}]);
