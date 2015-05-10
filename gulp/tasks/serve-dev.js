/**
 * @fileoverview Defines a task to launch a development server.
 */

'use strict';

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
        var app = conn();
        var html = htmlAssets(config);
        var js = jsAssets(config);
        var css = cssAssets(config);

        app.use(pipeline([
            {url: '/' + config.outputFiles.app.index, pipeline: function () {
                return html.getIndexFileStream();
            }},
            {url: '/' + config.outputFiles.app.js, pipeline: function () {
                return js.getDevAssetStream()
                    .pipe(sourcemaps.write());
            }},
            {url: '/' + config.outputFiles.app.css, pipeline: function () {
                return css.getAssetStream()
                    .pipe(sourcemaps.write());
            }},
            {url: '/' + config.outputFiles.deps.js, pipeline: function () {
                return js.getDepsAssetStream()
                    .pipe(addStream.obj(gulp.src(config.project.devDependencies)))
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(concat(config.outputFiles.deps.js))
                    .pipe(sourcemaps.write());
            }},
            {url: '/' + config.outputFiles.deps.css, pipeline: function () {
                return css.getDepsAssetStream()
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(concat(config.outputFiles.deps.js))
                    .pipe(sourcemaps.write());
            }}
        ]));

        app.use(serveStatic('dev'));

        _.each(config.project.urlMappings, function (dir, url) {
            app.use(url, serveStatic(dir));
        });

        app.listen(config.server.devPort);
    };
};
