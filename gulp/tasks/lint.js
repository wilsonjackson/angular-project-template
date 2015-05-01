/**
 * @fileoverview Defines a task to lint js sources.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var jshint = require('gulp-jshint');

module.exports = function (config) {
    /**
     * Lints all js in `src`, including tests.
     *
     * @return {stream.Readable}
     */
    return function () {
        return gulp.src(path.join(config.paths.src, config.filePatterns.js.all))
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    };
};
