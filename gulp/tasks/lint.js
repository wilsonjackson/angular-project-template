'use strict';

var gulp = require('gulp');
var path = require('path');
var jshint = require('gulp-jshint');

module.exports = function (config) {
	return {
		/**
		 * Lints all js in `src`, including tests.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			return gulp.src(path.join(config.paths.src, config.filePatterns.js.all))
				.pipe(jshint())
				.pipe(jshint.reporter('default'));
		},

		/**
		 * Registers the `lint` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'lint')
		 */
		register: function (name) {
			gulp.task(name || 'lint', this.task);
		}
	};
};
