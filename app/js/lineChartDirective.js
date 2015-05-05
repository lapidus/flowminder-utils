'use strict';

angular.module('flowminderUtils')
	.directive('lineChart', [function() {

		var linker = function(scope, element, attrs) {

			

		};

		return {
			name: 'lineChart',
			scope: {
				'lineChart': '='
			},
			restrict: 'A',
			template: '<h2>Line Chart</h2>',
			// templateUrl: '',
			link: linker
		};
	}]);
