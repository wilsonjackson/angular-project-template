/**
 * @fileoverview Defines a task to launch a development server.
 */

'use strict';

var path = require('path');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var addStream = require('add-stream');
var _ = require('lodash');
var conn = require('connect');
var serveStatic = require('serve-static');
var pipeline = require('connect-resource-pipeline');
var htmlAssets = require('../streams/html-assets.js');
var jsAssets = require('../streams/js-assets.js');
var cssAssets = require('../streams/css-assets.js');

module.exports = function (config) {
    /**
     * Launches the development server.
     *
     * The `src` directory is used as the document root, so html, images and other assets are accessible at their
     * expected URLs.
     *
     * The server will also dynamically concatenate javascript and less/css assets at request time, allowing
     * real-time updates without requiring a build or a server restart (or even a watch).
     *
     * Additionally, the contents of the `dev` directory will be _overlaid_ on top of the document root, allowing
     * specific paths to be masked with development versions, and any javascript assets in `dev` will be
     * concatenated onto the end of the main js file, allowing the app's behavior to be augmented or extended for
     * development purposes.
     */
    return function () {
        var html = htmlAssets(config);
        var js = jsAssets(config);
        var css = cssAssets(config);

        var assetPipeline = pipeline([
            {url: '/' + config.outputFiles.app.index, cache: 'index', pipeline: function () {
                return html.getIndexFileStream();
            }},
            {url: '/' + config.outputFiles.app.js, cache: 'js', pipeline: function () {
                return js.getDevAssetStream()
                    .pipe(sourcemaps.write());
            }},
            {url: '/' + config.outputFiles.app.css, cache: 'css', pipeline: function () {
                return css.getAssetStream()
                    .pipe(sourcemaps.write());
            }},
            {url: '/' + config.outputFiles.deps.js, cache: true, pipeline: function () {
                return js.getDepsAssetStream()
                    .pipe(addStream.obj(gulp.src(config.project.devDependencies)))
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(concat(config.outputFiles.deps.js))
                    .pipe(sourcemaps.write());
            }},
            {url: '/' + config.outputFiles.deps.css, cache: true, pipeline: function () {
                return css.getDepsAssetStream()
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(concat(config.outputFiles.deps.js))
                    .pipe(sourcemaps.write());
            }}
        ]);

        function clearCache(key) {
            return function () {
                assetPipeline.clear(key);
            };
        }

        // Watch sources and clear caches when contents change.
        // Note: deps are not watched, so a change of deps requires a server restart.
        gulp.watch(path.join(config.paths.src, config.outputFiles.app.index), clearCache('index'));
        gulp.watch([
            path.join(config.paths.src, config.filePatterns.js.src),
            path.join(config.paths.dev, config.filePatterns.js.src),
            path.join(config.paths.src, config.filePatterns.html.all)
        ], clearCache('js'));
        gulp.watch(path.join(config.paths.src, config.filePatterns.less.all), clearCache('css'));

        var app = conn();
        app.use(assetPipeline);
        app.use(serveStatic('dev'));

        _.each(config.project.urlMappings, function (dir, url) {
            app.use(url, serveStatic(dir));
        });

        app.listen(config.server.devPort);
    };
};
