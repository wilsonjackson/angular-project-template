describe('Test', () => {
    'use strict';

describe('Test', function () {
    var $controller;
    var $rootScope;

    beforeEach(module('fish'));

    beforeEach(inject((_$controller_, _$rootScope_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    it('should do stuff', () => {
        $controller('Fish', {$scope: $rootScope});

        expect($rootScope.fish).not.to.contain('Carp');

        expect($rootScope.fish).to.contain('Trout!??');
    });
});
