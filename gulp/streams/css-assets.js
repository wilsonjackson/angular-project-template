/**
 * @fileoverview Creates streams of the project's css assets.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var gIf = require('gulp-if');
var filter = require('gulp-filter');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var blibs = require('browser-libs');

module.exports = function (config) {
	return {
		/**
		 * Creates a readable stream containing the app's css assets, compiled from less and optionally minified.
		 *
		 * @param {boolean} [minify] Whether to minify the assets (default false).
		 * @return {stream.Readable}
		 */
		getAssetStream: function (minify) {
			return gulp.src(path.join(config.paths.src, config.filePatterns.less.all))
				// Filter out ignored files (that are locally @imported)
				.pipe(filter(['**/*', '!' + config.filePatterns.less.excludes]))
				.pipe(less())
				.pipe(autoprefixer())
				.pipe(gIf(minify, csso()));
		},

		/**
		 * Creates a readable stream containing the app's dependencies.
		 *
		 * @returns {stream.Readable}
		 */
		getDepsAssetStream: function () {
			return gulp.src(blibs.style(), {base: config.paths.deps});
		}
	};
};
