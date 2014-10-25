/**
 * @fileoverview Creates streams of the project's js assets.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var gIf = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var blibs = require('../../../browser-libs');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');

module.exports = function (config) {
	var watchedBundler = null;

	/**
	 * Initializes a browserify bundler containing the main application sources.
	 *
	 * @param {object} args Arguments for browserify.
	 * @returns {function(): stream.Readable}
	 */
	function createBundler(args) {
		var bundler = browserify(_.assign({basedir: config.project.basedir, excludeExternal: true}, args || {}));
		bundler.add('./' + path.join(config.paths.src, config.filePatterns.js.entryPoint));
		return bundler;
	}

	/**
	 * Processes a browserify bundle into a full js asset stream.
	 *
	 * @param {stream.Readable} bundle
	 * @param {boolean} minify
	 * @returns {stream.Readable}
	 */
	function bundleToAssetStream(bundle, minify) {
		return bundle
			.pipe(source(config.outputFiles.app.js))
			.pipe(buffer())
			.pipe(ngAnnotate())
			.pipe(gIf(minify, uglify()));
	}

	return {
		/**
		 * Creates a readable stream containing the app's js assets, optionally minified.
		 *
		 * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
		 *
		 * @param {boolean} [minify] Whether to minify the assets (default false).
		 * @return {stream.Readable}
		 */
		getAssetStream: function (minify) {
			return bundleToAssetStream(createBundler().bundle(), minify);
		},

		/**
		 * Adds js assets from the dev source root to the main app's js assets.
		 *
		 * Dev assets are appended to the main assets, allowing them to piggyback on the main app and override/extend
		 * stuff easily.
		 *
		 * @param {boolean} [minify] Whether to minify the assets (default false).
		 * @return {stream.Readable}
		 */
		getDevAssetStream: function (minify) {
			if (watchedBundler === null) {
				var bundler = createBundler(watchify.args);
				bundler.add('./' + path.join(config.paths.dev, config.filePatterns.js.devEntryPoint));
				watchedBundler = watchify(bundler);
			}
			return bundleToAssetStream(watchedBundler.bundle(), minify);
		},

		/**
		 * Creates a readable stream containing the app's dependencies.
		 *
		 * @returns {stream.Readable}
		 */
		getDepsAssetStream: function () {
			return es.readable(function () {
				var self = this;
				blibs(function (err, libs) {
					if (err) {
						return self.emit('error', err);
					}
					gulp.src(libs).pipe(es.through(function (file) {
						self.emit('data', file);
					}, function () {
						self.emit('end');
					}));
				});
			});
		}
	};
};
