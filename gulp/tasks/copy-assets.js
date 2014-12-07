/**
 * @fileoverview Defines a task to copy non-buildable assets for production use.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var filter = require('gulp-filter');
var _ = require('lodash');

module.exports = function (config) {
	return {
		/**
		 * Copies assets not processed by the `build-*` tasks into `dist`.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			var streams = [];
			streams.push(gulp.src(path.join(config.paths.src, '**/*'))
				.pipe(filter([
					'**/*.*', // *.* pattern excludes empty directories
					'!' + config.filePatterns.html.all,
					'!' + config.filePatterns.js.all,
					'!' + config.filePatterns.js.fileWrapper,
					'!' + config.filePatterns.js.appWrapper,
					'!' + config.filePatterns.less.all
				]))
				.pipe(gulp.dest(config.paths.dist)));
			_.forEach(config.project.urlMappings, function (srcPath, destPath) {
				streams.push(gulp.src(path.join(config.project.basedir, srcPath, '**/*'))
					.pipe(gulp.dest(path.join(config.paths.dist, destPath.replace(/^\//, '')))));
			});
			return es.merge.apply(es, streams);
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
