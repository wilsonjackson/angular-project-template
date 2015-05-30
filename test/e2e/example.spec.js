'use strict';

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;

describe('stuff', function () {
    it('should bonk', function () {
        browser.get('/');

        var div = element(by.css('.fish'));
        expect(div.getText()).not.to.eventually.contain('Carp');
        expect(div.getText()).to.eventually.contain('Trout');
    });
});
