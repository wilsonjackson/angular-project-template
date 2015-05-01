/**
 * @fileoverview Defines a task to build production js assets.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var jsAssets = require('../streams/js-assets.js');

module.exports = function (config) {
    /**
     * Compiles all of the app's js into a single, minified asset in `dist`, which includes pre-cached templates.
     *
     * @return {stream.Readable}
     */
    return function () {
        return jsAssets(config).getAssetStream()
            .pipe(concat(config.outputFiles.app.js))
            .pipe(wrap({src: path.join(config.paths.src, config.filePatterns.js.appWrapper)}))
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest(config.paths.dist))
            .pipe(rev.manifest({path: config.outputFiles.app.rev.js}))
            .pipe(gulp.dest(config.paths.rev));
    };
};
