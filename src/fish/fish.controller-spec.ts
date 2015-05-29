declare var expect: Chai.ExpectStatic;

describe('Test', () => {
    'use strict';

    var $controller;
    var $rootScope;

    beforeEach(module('app.fish'));

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
