/**
 * @fileoverview Creates streams of the project's js assets.
 */

'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var addStream = require('add-stream');
var wrap = require('gulp-wrap-js');
var order = require('gulp-order');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngTplCache = require('gulp-angular-templatecache');
var blibs = require('browser-libs');
var htmlAssets = require('./html-assets');

module.exports = function (config) {
    //noinspection JSUnresolvedFunction
    var fileWrapper = fs.readFileSync(path.join(config.paths.src, config.filePatterns.js.fileWrapper)).toString();
    //noinspection JSUnresolvedFunction
    var appWrapper = fs.readFileSync(path.join(config.paths.src, config.filePatterns.js.appWrapper)).toString();

    // Main application source bundle builder, used by both getAssetStream and getDevAssetStream.
    function sources() {
        return gulp.src(path.join(config.paths.src, config.filePatterns.js.src))
            .pipe(order(config.filePatterns.js.sorted))
            .pipe(sourcemaps.init())
            .pipe(wrap(fileWrapper))
            .pipe(ngAnnotate())
            // Append the html assets (transformed into js) after the js assets
            .pipe(addStream.obj(htmlAssets(config).getTemplateAssetStream()
                .pipe(ngTplCache({module: config.project.templateCacheModule, standalone: true}))
                .pipe(sourcemaps.init())));
    }

    return {
        /**
         * Creates a readable stream containing the app's js assets, optionally minified.
         *
         * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
         *
         * @return {stream.Readable}
         */
        getAssetStream: function () {
            return sources()
                .pipe(concat({path: config.outputFiles.app.js, cwd: ''}))
                .pipe(wrap(appWrapper))
                .pipe(uglify());
        },

        /**
         * Adds js assets from the dev source root to the main app's js assets.
         *
         * Dev assets are appended to the main assets, allowing them to piggyback on the main app and override/extend
         * stuff easily.
         *
         * @return {stream.Readable}
         */
        getDevAssetStream: function () {
            return sources()
                .pipe(addStream.obj(gulp.src(path.join(config.paths.dev, config.filePatterns.js.all))
                    .pipe(order(config.filePatterns.js.sorted))
                    .pipe(sourcemaps.init())
                    .pipe(wrap(fileWrapper))
                    .pipe(ngAnnotate())))
                .pipe(concat({path: config.outputFiles.app.js, cwd: ''}))
                .pipe(wrap(appWrapper))
                .pipe(uglify());
        },

        /**
         * Creates a readable stream containing the app's dependencies.
         *
         * @returns {stream.Readable}
         */
        getDepsAssetStream: function () {
            return gulp.src(blibs(), {base: config.paths.deps});
        }
    };
};
