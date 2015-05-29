'use strict';

describe('Test', function () {
    var $controller;
    var $rootScope;

    beforeEach(module('fish'));

    beforeEach(inject(function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    it('should do stuff', function () {
        $controller('Fish', {$scope: $rootScope});
        expect($rootScope.fish).not.to.contain('Carp');
        expect($rootScope.fish).to.contain('Trout');
    });
});
