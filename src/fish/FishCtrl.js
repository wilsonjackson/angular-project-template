'use strict';

/**
 *
 * @ngInject
 * @param $scope
 * @param fishTpl
 * @constructor
 */
function FishCtrl($scope, fishTpl) {
	$scope.fish = 'Carp' + fishTpl;
}

module.exports = FishCtrl;
