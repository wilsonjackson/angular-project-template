/**
 * @fileoverview Defines a task to build production dependency assets.
 */

'use strict';

var gulp = require('gulp');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var bower = require('main-bower-files');

module.exports = function (config) {
	return {
		/**
		 * Compiles all of the app's dependencies and writes them to `dist`.
		 *
		 * This will produce a single js file containing all concatenated scripts and a single css file containing all
		 * concatenated stylesheets. Neither file is minified, as it is presumed that they are supplied in minified form.
		 *
		 * If there are any dependency files of types other than js or css, they'll be copied as-is to `dist`.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			var jsFilter = filter(config.filePatterns.js.all);
			var cssFilter = filter(config.filePatterns.css.all);

			// Base path must be specified explicitly or the process of including and excluding files via a filter results in
			// absolute file paths being written to the rev manifest rather than relative ones.
			return gulp.src(bower(), {base: config.paths.bower})
				.pipe(jsFilter)
				.pipe(concat(config.outputFiles.deps.js))
				.pipe(jsFilter.restore())
				.pipe(cssFilter)
				.pipe(concat(config.outputFiles.deps.css))
				.pipe(cssFilter.restore())
				.pipe(rev())
				.pipe(gulp.dest(config.paths.dist))
				.pipe(rev.manifest({path: config.outputFiles.deps.rev}))
				.pipe(gulp.dest(config.paths.rev));
		},

		/**
		 * Registers the `build-deps` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'build-deps')
		 */
		register: function (name) {
			gulp.task(name || 'build-deps', this.task);
		}
	};
};
