/**
 * @fileoverview Defines a task to launch a development server.
 */

'use strict';

var gulp = require('gulp');
var addStream = require('add-stream');
var connect = require('gulp-connect');
var pipeline = require('connect-resource-pipeline');
var htmlAssets = require('../streams/html-assets.js');
var jsAssets = require('../streams/js-assets.js');
var cssAssets = require('../streams/css-assets.js');

module.exports = function (config) {
	return {
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
		task: function () {
			//noinspection JSUnusedGlobalSymbols
			connect.server({
				root: config.paths.src,
				port: config.server.devPort,
				middleware: function (connect) {
					var html = htmlAssets(config);
					var js = jsAssets(config);
					var css = cssAssets(config);

					return [
						connect().use(pipeline([
							{url: '/' + config.outputFiles.app.index, pipeline: function () {
								return html.getIndexFileStream();
							}},
							{url: '/' + config.outputFiles.app.js, pipeline: function () {
								return js.getDevAssetStream();
							}},
							{url: '/' + config.outputFiles.app.css, pipeline: function () {
								return css.getAssetStream();
							}},
							{url: '/' + config.outputFiles.deps.js, pipeline: function () {
								return js.getDepsAssetStream()
									.pipe(addStream.obj(gulp.src(config.project.devDependencies)));
							}},
							{url: '/' + config.outputFiles.deps.css, pipeline: function () {
								return css.getDepsAssetStream();
							}}
						])),
						connect().use(connect.static('dev'))
					];
				}
			});
		},

		/**
		 * Registers the `serve-dev` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'serve-dev')
		 */
		register: function (name) {
			gulp.task(name || 'serve-dev', this.task);
		}
	};
};
