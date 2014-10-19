'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var File = require('vinyl');
var filter = require('gulp-filter');
var inject = require('gulp-inject');

/**
 * Transforms a list of file names into a readable stream of vinyl File objects.
 *
 * @return {stream.Readable}
 */
function fileRefs(/* ...files */) {
	var files = Array.prototype.slice.call(arguments);
	return es.readArray(files.map(function (filePath) {
		return new File({path: filePath});
	}));
}

module.exports = function (config) {
	return {
		/**
		 * Creates a readable stream containing the app's index html with resource paths already injected.
		 *
		 * @return {stream.Readable}
		 */
		getIndexFileStream: function () {
			return gulp.src(path.join(config.paths.src, config.outputFiles.app.index))
				// Inject app file references
				.pipe(inject(fileRefs(config.outputFiles.app.js, config.outputFiles.app.css),
					{addRootSlash: false}))
				// Inject deps file references
				.pipe(inject(fileRefs(config.outputFiles.deps.js, config.outputFiles.deps.css),
					{name: 'deps', addRootSlash: false}));
		},

		/**
		 * Creates a readable stream containing all the app's partial templates (everything but the index).
		 *
		 * @return {stream.Readable}
		 */
		getTemplateStream: function () {
			return gulp.src(path.join(config.paths.src, config.filePatterns.html.all))
				// Filter out the index file
				.pipe(filter(['**/*', '!' + config.outputFiles.app.index]));
		}
	};
};
