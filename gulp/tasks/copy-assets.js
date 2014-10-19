'use strict';

var gulp = require('gulp');
var path = require('path');
var filter = require('gulp-filter');

module.exports = function (config) {
	return {
		/**
		 * Copies assets not processed by the `build-*` tasks into `dist`.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			return gulp.src(path.join(config.paths.src, '**/*'))
				.pipe(filter([
					'**/*.*', // *.* pattern excludes empty directories
						'!' + config.filePatterns.html.all,
						'!' + config.filePatterns.js.all,
						'!' + config.filePatterns.less.all
				]))
				.pipe(gulp.dest(config.paths.dist));
		},

		/**
		 * Registers the `copy-assets` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'copy-assets')
		 */
		register: function (name) {
			gulp.task(name || 'copy-assets', this.task);
		}
	};
};
