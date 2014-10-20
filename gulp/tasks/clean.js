/**
 * @fileoverview Defines a task to delete build artifacts.
 */

'use strict';

var gulp = require('gulp');
var del = require('del');

module.exports = function (config) {
	return {
		/**
		 * Deletes all build output directories.
		 *
		 * @param {Function} cb Done callback.
		 */
		task: function (cb) {
			del([config.paths.rev, config.paths.dist], cb);
		},

		/**
		 * Registers the `clean` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'clean')
		 */
		register: function (name) {
			gulp.task(name || 'clean', this.task);
		}
	};
};
