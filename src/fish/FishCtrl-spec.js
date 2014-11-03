'use strict';

require('../app');
var ngmod = require('ngmod');
var inject = require('nginject');

describe('Test', function () {
	var $controller;
	var $rootScope;

	beforeEach(ngmod('app'));

	beforeEach(inject(function (_$controller_, _$rootScope_) {
		$controller = _$controller_;
		$rootScope = _$rootScope_;
	}));

	it('should do stuff', function () {
		$controller('FishCtrl', {$scope: $rootScope});
		expect($rootScope.fish).not.toContain('Carp');
		expect($rootScope.fish).toContain('Trout');
		expect($rootScope.fish).toContain('fish');
	});
});
