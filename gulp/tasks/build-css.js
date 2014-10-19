'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var cssResources = require('../resources/css-resources.js');

module.exports = function (config) {
	return {
		/**
		 * Compiles all of the app's less files into a single, minified css asset in `dist`.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			return cssResources(config).getResourceStream()
				.pipe(concat(config.outputFiles.app.css))
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
