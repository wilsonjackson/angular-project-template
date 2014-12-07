'use strict';

describe('Test', function () {
	var $controller;
	var $rootScope;

	beforeEach(module('app'));

	beforeEach(inject(function (_$controller_, _$rootScope_) {
		$controller = _$controller_;
		$rootScope = _$rootScope_;
	}));

	it('should do stuff', function () {
		$controller('Fish', {$scope: $rootScope});
		expect($rootScope.fish).not.toContain('Carp');
		expect($rootScope.fish).toContain('Trout');
	});
});
