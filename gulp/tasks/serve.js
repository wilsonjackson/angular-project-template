/**
 * @fileoverview Defines a task to launch a server using production assets.
 */

'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

module.exports = function (config) {
	return {
		/**
		 * Launches a web server using the contents of `dist` as the document root.
		 *
		 * This is useful for testing production assets.
		 */
		task: function () {
			connect.server({
				root: config.paths.dist,
				port: config.server.port
			});
		},

		/**
		 * Registers the `serve` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'serve')
		 */
		register: function (name) {
			gulp.task(name || 'serve', this.task);
		}
	};
};
