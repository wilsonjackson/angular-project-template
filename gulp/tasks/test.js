'use strict';

var ARGV = require('yargs').argv;
var gulp = require('gulp');
var path = require('path');
var karma = require('karma').server;

module.exports = function (config) {
	return {
		/**
		 * Runs the unit test suite.
		 *
		 * @param {Function} done Done callback.
		 */
		task: function (done) {
			if (ARGV.skipTests) {
				done();
				return;
			}
			karma.start({
				configFile: path.join(config.project.basedir, 'karma.conf.js'),
				singleRun: true
			}, done);
		},

		/**
		 * Registers the `test` task with gulp.
		 *
		 * @param {string} [name] Task name (default: 'test')
		 */
		register: function (name) {
			gulp.task(name || 'test', this.task);
		}
	};
};
