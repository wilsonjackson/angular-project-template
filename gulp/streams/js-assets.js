/**
 * @fileoverview Creates streams of the project's js assets.
 */

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
var htmlAssets = require('./html-assets.js');
var blibs = require('../../../browser-libs');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function (config) {
	return {
		/**
		 * Creates a readable stream containing the app's js assets, optionally minified.
		 *
		 * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
		 *
		 * @param {boolean} [minify] Whether to minify the assets (default false).
		 * @return {stream.Readable}
		 */
		getAssetStream: function (minify) {
			var bundler = browserify({basedir: config.project.basedir, excludeExternal: true});
			bundler.add('./' + path.join(config.paths.src, config.filePatterns.js.entryPoint));

			return es.merge(
				bundler.bundle()
					.pipe(source(config.outputFiles.app.js))
					.pipe(buffer())
					.pipe(ngAnnotate()),
				htmlAssets(config).getTemplateStream()
					.pipe(ngTemplates({module: config.project.module})))
				.pipe(ngSort())
				.pipe(gIf(minify, uglify()));
		},

		/**
		 * Adds js assets from the dev source root to the main app's js assets.
		 *
		 * Dev assets are appended to the main assets, allowing them to piggyback on the main app and override/extend
		 * stuff easily.
		 *
		 * @param {boolean} [minify] Whether to minify the assets (default false).
		 * @return {stream.Readable}
		 */
		getDevAssetStream: function (minify) {
			return es.merge(
				this.getAssetStream(minify),
				gulp.src(path.join(config.paths.dev, config.filePatterns.js.all))
					// Filter out tests
					.pipe(filter(['**/*', '!' + config.filePatterns.js.tests]))
					.pipe(ngSort()));
		},

		/**
		 * Creates a readable stream containing the app's dependencies.
		 *
		 * @returns {stream.Readable}
		 */
		getDepsAssetStream: function () {
			return es.readable(function () {
				var self = this;
				blibs(function (err, libs) {
					if (err) {
						return self.emit('error', err);
					}
					gulp.src(libs).pipe(es.through(function (file) {
						self.emit('data', file);
					}, function () {
						self.emit('end');
					}));
				});
			});
		}
	};
};
