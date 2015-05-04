'use strict';

angular.module('flowminderUtils', [])
	.controller('mainCtrl', ['$scope', function($scope) {

		console.log('Main controller loaded.');

	}])
	.directive('map', [function() {

		var linker = function(scope, element, attrs) {
			console.log('Map directive loaded.');
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
