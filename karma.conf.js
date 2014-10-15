// Karma configuration
// Generated on Mon Oct 13 2014 21:43:18 GMT-0700 (PDT)

var path = require('path');
var bower = require('main-bower-files');
var build = require('./gulpfile.js');

module.exports = function (config) {
	// gulpfile.js exports its configuration, so it's leveraged here to not have to repeat file patterns (and so things
	// won't break so easily if they change).
	var bowerFiles = bower({includeDev: true}).filter(function (file) {
		return file.substr(-3) === '.js';
	});
	var jsFiles = [].concat(build.config.filePatterns.js.all).map(function (pattern) {
		return path.join(build.config.paths.src, pattern);
	});

	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'angular-filesort'],

		// list of files / patterns to load in the browser
		files: bowerFiles.concat(jsFiles),

		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
		},

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
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		angularFilesort: {
			whitelist: jsFiles
		}
	});
};
