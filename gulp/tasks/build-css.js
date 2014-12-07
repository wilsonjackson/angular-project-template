/**
 * @fileoverview Defines a task to build production css assets.
 */

'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var cssAssets = require('../streams/css-assets.js');

module.exports = function (config) {
	return {
		/**
		 * Compiles all of the app's less files into a single, minified css asset in `dist`.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			return cssAssets(config).getAssetStream()
				.pipe(concat(config.outputFiles.app.css))
				.pipe(csso())
				.pipe(rev())
				.pipe(gulp.dest(config.paths.dist))
				.pipe(rev.manifest({path: config.outputFiles.app.rev.css}))
				.pipe(gulp.dest(config.paths.rev));
		},

		/**
		 * Registers the `build-css` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'build-css')
		 */
		register: function (name) {
			gulp.task(name || 'build-css', this.task);
		}
	};
};
