'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var revCollector = require('gulp-rev-collector');
var htmlResources = require('../resources/html-resources.js');

module.exports = function (config) {
	return {
		/**
		 * Injects the index file with script and stylesheet references and writes it to `dist`.
		 *
		 * @return {stream.Readable}
		 */
		task: function () {
			return es.merge(
					htmlResources(config).getIndexFileStream(),
					gulp.src(path.join(config.paths.rev, config.filePatterns.rev.all)))
				.pipe(revCollector())
				.pipe(gulp.dest(config.paths.dist));
		},

		/**
		 * Registers the `build-html` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'build-html')
		 */
		register: function (name) {
			gulp.task(name || 'build-html', this.task);
		}
	};
};
