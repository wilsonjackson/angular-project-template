'use strict';

angular.module('fish').controller('Fish', FishCtrl);

/**
 *
 * @ngInject
 * @param $scope
 * @constructor
 */
function FishCtrl($scope) {
	$scope.fish = 'Trout';
}
