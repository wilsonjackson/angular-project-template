'use strict';

/**
 *
 * @ngInject
 * @param $scope
 * @param fishTpl
 * @constructor
 */
function FishCtrl($scope, fishTpl) {
	$scope.fish = 'Trout ' + fishTpl;
}

module.exports = FishCtrl;
