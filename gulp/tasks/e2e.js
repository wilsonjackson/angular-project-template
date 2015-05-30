/**
 * @fileoverview Defines a task to run end-to-end tests.
 *
 * Credit for implementation:
 * https://github.com/mllrsohn/gulp-protractor#running-protractor-without-a-plugin
 */

'use strict';

var path = require('path');
var childProcess = require('child_process');

function getProtractorBinary(binaryName) {
    var winExt = /^win/.test(process.platform) ? '.cmd' : '';
    var pkgPath = require.resolve('protractor');
    var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
    return path.join(protractorDir, '/' + binaryName + winExt);
}

module.exports = function (config) {
    function protractor(done) {
        var argv = [path.join(config.project.basedir, 'protractor.conf.js')];
        childProcess.spawn(getProtractorBinary('protractor'), argv, {
            stdio: 'inherit'
        }).once('close', done);
    }

    protractor.update = function (done) {
        childProcess.spawn(getProtractorBinary('webdriver-manager'), ['update'], {
            stdio: 'inherit'
        }).once('close', done);
    };

    return protractor;
};
