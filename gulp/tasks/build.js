/**
 * @fileoverview Defines a task to build the project and output production assets.
 */

'use strict';

var gulp = require('gulp');
var sequence = require('run-sequence');

module.exports = function () {
	return {
		/**
		 * Performs a full build.
		 *
		 * @param {Function} cb Done callback.
		 */
		task: function (cb) {
			sequence(
				'clean',
				'lint',
				'test',
				['build-js', 'build-css', 'build-deps'],
				['build-html', 'copy-assets'],
				cb);
		},

		/**
		 * Registers the `build` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'build')
		 */
		register: function (name) {
			gulp.task(name || 'build', this.task);
		}
	};
};
