/**
 * @fileoverview Defines a task to build production js assets.
 */

'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var jsAssets = require('../streams/js-assets.js');

module.exports = function (config) {
	return {
		/**
		 * Compiles all of the app's js into a single, minified asset in `dist`, which includes pre-cached templates.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			return jsAssets(config).getAssetStream(true)
				.pipe(concat(config.outputFiles.app.js))
				.pipe(rev())
				.pipe(gulp.dest(config.paths.dist))
				.pipe(rev.manifest({path: config.outputFiles.app.rev.js}))
				.pipe(gulp.dest(config.paths.rev));
		},

		/**
		 * Registers the `build-js` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'build-js')
		 */
		register: function (name) {
			gulp.task(name || 'build-js', this.task);
		}
	};
};
