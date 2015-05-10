describe('Test', () => {
    'use strict';

    var $controller;
    var $rootScope;

    beforeEach(module('app'));

    beforeEach(inject((_$controller_, _$rootScope_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    it('should do stuff', () => {
        $controller('Fish', {$scope: $rootScope});

        expect($rootScope.fish).not.toContain('Carp');

        expect($rootScope.fish).toContain('Trout!??');
    });
});
