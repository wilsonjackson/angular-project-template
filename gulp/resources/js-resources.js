'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var gIf = require('gulp-if');
var filter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var ngTemplates = require('gulp-angular-templatecache');
var ngSort = require('gulp-angular-filesort');
var uglify = require('gulp-uglify');
var htmlResources = require('./html-resources.js');

module.exports = function (config) {
	return {
		/**
		 * Creates a readable stream containing the app's js resources, optionally minified.
		 *
		 * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
		 *
		 * @param {boolean} [minify] Whether to minify the resources (default false).
		 * @return {stream.Readable}
		 */
		getResourceStream: function (minify) {
			return es.merge(
				gulp.src(path.join(config.paths.src, config.filePatterns.js.all))
					// Filter out tests
					.pipe(filter(['**/*', '!' + config.filePatterns.js.tests]))
					.pipe(ngAnnotate()),
				htmlResources(config).getTemplateStream()
					.pipe(ngTemplates({module: config.project.module})))
				.pipe(ngSort())
				.pipe(gIf(minify, uglify()));
		},

		/**
		 * Adds js resources from the dev source root to the main app's js resources.
		 *
		 * Dev resources are appended to the main resources, allowing them to piggyback on the main app and override/extend
		 * stuff easily.
		 *
		 * @param {boolean} [minify] Whether to minify the resources (default false).
		 * @return {stream.Readable}
		 */
		getDevResourceStream: function (minify) {
			return es.merge(
				this.getResourceStream(minify),
				gulp.src(path.join(config.paths.dev, config.filePatterns.js.all))
					// Filter out tests
					.pipe(filter(['**/*', '!' + config.filePatterns.js.tests]))
					.pipe(ngSort()));
		}
	};
};
