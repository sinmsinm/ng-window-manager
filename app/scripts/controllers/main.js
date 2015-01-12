'use strict';

/**
 * @ngdoc function
 * @name winamnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the winamnApp
 */
angular.module('wmExampleApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'One',
      'Two',
      'Three'
    ];
	  
	$scope.win ={};
	$scope.win.newtitle = '';
	  
	$scope.myfunction = function (){
		console.log ('Window');	
	};
	
	$scope.options = {
		position: {x: 120, y:320},
		size: {width: 300, height:300}
	};
	 
	$scope.add = function (){
		$scope.awesomeThings.unshift($scope.win.newtitle);
	};
	  
  });
