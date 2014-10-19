'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var pipeline = require('connect-resource-pipeline');
var filter = require('gulp-filter');
var bower = require('main-bower-files');
var htmlResources = require('../resources/html-resources.js');
var jsResources = require('../resources/js-resources.js');
var cssResources = require('../resources/css-resources.js');

module.exports = function (config) {
	return {
		/**
		 * Launches the development server.
		 *
		 * The `src` directory is used as the document root, so html, images and other resources are accessible at their
		 * expected URLs.
		 *
		 * The server will also dynamically concatenate javascript and less/css resources at request time, allowing real-time
		 * updates without requiring a build or a server restart (or even a watch).
		 *
		 * Additionally, the contents of the `dev` directory will be _overlaid_ on top of the document root, allowing specific
		 * paths to be masked with development versions, and any javascript resources in `dev` will be concatenated onto the
		 * end of the main js file, allowing the app's behavior to be augmented or extended for development purposes.
		 */
		task: function () {
			//noinspection JSUnusedGlobalSymbols
			connect.server({
				root: config.paths.src,
				port: config.server.devPort,
				middleware: function (connect) {
					return [
						connect().use(pipeline([
							{url: '/' + config.outputFiles.app.index, pipeline: function () {
								return htmlResources(config).getIndexFileStream();
							}},
							{url: '/' + config.outputFiles.app.js, pipeline: function () {
								return jsResources(config).getDevResourceStream(false);
							}},
							{url: '/' + config.outputFiles.app.css, pipeline: function () {
								return cssResources(config).getResourceStream(false);
							}},
							{url: '/' + config.outputFiles.deps.js, pipeline: function () {
								return gulp.src(bower()).pipe(filter(config.filePatterns.js.all));
							}},
							{url: '/' + config.outputFiles.deps.css, pipeline: function () {
								return gulp.src(bower()).pipe(filter(config.filePatterns.css.all));
							}}
						])),
						connect().use(connect.static('dev'))
					];
				}
			});
		},

		/**
		 * Registers the `dev` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'dev')
		 */
		register: function (name) {
			gulp.task(name || 'dev', this.task);
		}
	};
};
