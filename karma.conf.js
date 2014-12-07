// Karma configuration
// Generated on Mon Oct 13 2014 21:43:18 GMT-0700 (PDT)

var path = require('path');
var blibs = require('browser-libs');
var build = require('./gulpfile.js');

module.exports = function (config) {
	// gulpfile.js exports its configuration, which is leveraged here so file patterns don't have to be repeated (so
	// things won't break so easily if they change).
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: blibs()
			.concat(build.config.project.testDependencies)
			.concat(build.config.filePatterns.js.sorted.map(function (pattern) {
				return path.join(build.config.paths.src, pattern);
			})),

		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: (function (preprocessors) {
			preprocessors[path.join(build.config.paths.src, build.config.filePatterns.js.src)] = ['wrap'];
			return preprocessors;
		})({}),

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,
		autoWatchBatchDelay: 0,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		wrapPreprocessor: {
			file: path.join(build.config.paths.src, build.config.filePatterns.js.fileWrapper)
		}
	});
};
