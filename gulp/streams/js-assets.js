/**
 * @fileoverview Creates streams of the project's js assets.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var addStream = require('add-stream');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var order = require('gulp-order');
var ngAnnotate = require('gulp-ng-annotate');
var ngTplCache = require('gulp-angular-templatecache');
var blibs = require('browser-libs');
var htmlAssets = require('./html-assets');

module.exports = function (config) {
	return {
		/**
		 * Creates a readable stream containing the app's js assets, optionally minified.
		 *
		 * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
		 *
		 * @return {stream.Readable}
		 */
		getAssetStream: function () {
			return gulp.src(path.join(config.paths.src, config.filePatterns.js.src))
				.pipe(wrap({src: path.join(config.paths.src, config.filePatterns.js.fileWrapper)}))
				.pipe(order(config.filePatterns.js.sorted))
				.pipe(ngAnnotate())
				// Append the html assets (transformed into js) after the js assets
				.pipe(addStream.obj(htmlAssets(config).getTemplateAssetStream()
					.pipe(ngTplCache({module: config.project.module}))));
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
			return this.getAssetStream()
				.pipe(addStream.obj(gulp.src(path.join(config.paths.dev, config.filePatterns.js.all))
					.pipe(wrap({src: path.join(config.paths.src, config.filePatterns.js.fileWrapper)}))
					.pipe(order(config.filePatterns.js.sorted))
					.pipe(ngAnnotate())))
				.pipe(concat(config.outputFiles.app.js))
				.pipe(wrap({src: path.join(config.paths.src, config.filePatterns.js.appWrapper)}));
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
