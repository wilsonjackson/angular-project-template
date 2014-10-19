/**
 * @fileoverview Standard build file for an AngularJS-based SPA.
 * 
 * Included in this file are tasks to build production assets, run tests, lint code, and run a development server. Read
 * the docblock for specific tasks for more information.
 *
 * Primary configuration is defined in the {@link config} global, which is also exported so that other modules may
 * leverage it.
 */

'use strict';

var gulp = require('gulp');
var sequence = require('run-sequence');
var File = require('vinyl');
var path = require('path');
var del = require('del');
var es = require('event-stream');
var filter = require('gulp-filter');
var gIf = require('gulp-if');
var inject = require('gulp-inject');
var bower = require('main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var ngAnnotate = require('gulp-ng-annotate');
var ngSort = require('gulp-angular-filesort');
var ngTemplates = require('gulp-angular-templatecache');
var connect = require('gulp-connect');
var pipeline = require('connect-resource-pipeline');
var jshint = require('gulp-jshint');
var karma = require('karma').server;

/**
 * Build configuration.
 * 
 * The values declared in this config object are used throughout the build, and exported so that they may be referenced
 * by other node modules (for example, Karma).
 */
var config = {
	/**
	 * Information about the project.
	 */
	project: {
		// The name of the top-level angular module. This shouldn't change.
		module: 'app'
	},
	/**
	 * Server configuration.
	 */
	server: {
		port: 8080,
		devPort: 8080
	},
	/**
	 * Paths to important directories used by the build.
	 * 
	 * All paths are relative to the root project directory, which is gulp's `cwd`. Do not include a './' prefix or a
	 * trailing slash, as these paths are sometimes used as a component in `path.join()`.
	 */
	paths: {
		// Main application source root. All resource types are mixed together in src, and are differentiated at build
		// time using the file patterns below.
		src: 'src',
		// Dev-only source root. See dev task definition for details on how this is used.
		dev: 'dev',
		// Target directory for built artifacts.
		dist: 'dist',
		// Used during a build to store mappings of revisioned filenames.
		rev: 'rev',
		// Standard bower install directory.
		bower: 'bower_components'
	},
	/**
	 * Patterns for selecting files, typically used with `gulp.src()`.
	 * 
	 * All patterns should exclude any preceding slash, as they'll usually be combined with one of the paths above.
	 */
	filePatterns: {
		html: {
			// Includes the main index file and all Angular templates.
			all: '**/*.html'
		},
		js: {
			all: '**/*.js',
			tests: '**/*-spec.js'
		},
		css: {
			all: '**/*.css'
		},
		less: {
			all: '**/*.less',
			// Excludes are files that are manually @imported from other less files.
			excludes: '**/less/*.less'
		},
		rev: {
			all: '**/*.json'
		}
	},
	/**
	 * Destination filenames for assets created during a build.
	 */
	outputFiles: {
		app: {
			index: 'index.html',
			js: 'app.js',
			css: 'app.css',
			rev: {
				js: 'app-js-manifest.json',
				css: 'app-css-manifest.json'
			}
		},
		deps: {
			js: 'deps.js',
			css: 'deps.css',
			rev: 'deps-manifest.json'
		}
	}
};

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

/**
 * Creates a readable stream containing the app's index html with resource paths already injected.
 *
 * @return {stream.Readable}
 */
function indexFile() {
	return gulp.src(path.join(config.paths.src, config.outputFiles.app.index))
		// Inject app file references
		.pipe(inject(fileRefs(config.outputFiles.app.js, config.outputFiles.app.css),
			{addRootSlash: false}))
		// Inject deps file references
		.pipe(inject(fileRefs(config.outputFiles.deps.js, config.outputFiles.deps.css),
			{name: 'deps', addRootSlash: false}));
}

/**
 * Creates a readable stream containing the app's js resources, optionally minified.
 *
 * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
 *
 * @param {boolean} [minify] Whether to minify the resources (default false).
 * @return {stream.Readable}
 */
function jsResources(minify) {
	return es.merge(
		gulp.src(path.join(config.paths.src, config.filePatterns.js.all))
			// Filter out tests
			.pipe(filter(['**/*', '!' + config.filePatterns.js.tests]))
			.pipe(ngAnnotate()),
		gulp.src(path.join(config.paths.src, config.filePatterns.html.all))
			// Filter out the index file
			.pipe(filter(['**/*', '!' + config.outputFiles.app.index]))
			.pipe(ngTemplates({module: config.project.module})))
		.pipe(ngSort())
		.pipe(gIf(minify, uglify()));
}

/**
 * Adds js resources from the dev source root to the main app's js resources.
 *
 * Dev resources are appended to the main resources, allowing them to piggyback on the main app and override/extend
 * stuff easily.
 *
 * @param {boolean} [minify] Whether to minify the resources (default false).
 * @return {stream.Readable}
 */
function devJsResources(minify) {
	return es.merge(
		jsResources(minify),
		gulp.src(path.join(config.paths.dev, config.filePatterns.js.all))
			// Filter out tests
			.pipe(filter(['**/*', '!' + config.filePatterns.js.tests]))
			.pipe(ngSort()));
}

/**
 * Creates a readable stream containing the app's css resources, compiled from less and optionally minified.
 *
 * @param {boolean} [minify] Whether to minify the resources (default false).
 * @return {stream.Readable}
 */
function cssResources(minify) {
	return gulp.src(path.join(config.paths.src, config.filePatterns.less.all))
		// Filter out ignored files (that are locally @imported)
		.pipe(filter(['**/*', '!' + config.filePatterns.less.excludes]))
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gIf(minify, csso()));
}

/**
 * Launches a web server using the contents of `dist` as the document root.
 * 
 * This is useful for testing production assets.
 */
gulp.task('serve', function () {
	connect.server({
		root: config.paths.dist,
		port: config.server.port
	});
});

/**
 * Launches the development server.
 *
 * The `src` directory is used as the document root, so html, images and other resources are accessible at their
 * expected URLs.
 *
 * The server will also dynamically concatenate javascript and less/css resources at request time, allowing real-time
 * updates without requiring a build or a server restart (or even a watch).
 *
 * Additionally, the contents of the `dev` directory will be _overlaid_ on top of the document root, allowing specific
 * paths to be masked with development versions, and any javascript resources in `dev` will be concatenated onto the
 * end of the main js file, allowing the app's behavior to be augmented or extended for development purposes.
 */
gulp.task('dev', function () {
	//noinspection JSUnusedGlobalSymbols
	connect.server({
		root: config.paths.src,
		port: config.server.devPort,
		middleware: function (connect) {
			return [
				connect().use(pipeline([
					{url: '/' + config.outputFiles.app.index, pipeline: indexFile},
					{url: '/' + config.outputFiles.app.js, pipeline: devJsResources.bind(null, false)},
					{url: '/' + config.outputFiles.app.css, pipeline: cssResources.bind(null, false)},
					{url: '/' + config.outputFiles.deps.js, pipeline: function () {
						return gulp.src(bower()).pipe(filter(config.filePatterns.js.all));
					}},
					{url: '/' + config.outputFiles.deps.css, pipeline: function () {
						return gulp.src(bower()).pipe(filter(config.filePatterns.css.all));
					}}
				])),
				connect().use(connect.static('dev'))
			];
		}
	});
});

/**
 * Lints all js in `src`, including tests.
 */
gulp.task('lint', function () {
	return gulp.src(path.join(config.paths.src, config.filePatterns.js.all))
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

/**
 * Runs the unit test suite.
 */
gulp.task('test', function (done) {
	karma.start({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: true
	}, done);
});

/**
 * Deletes the `dist` directory and any other files/directories incidental to the build process.
 */
gulp.task('clean', function (cb) {
	del([config.paths.rev, config.paths.dist], cb);
});

/**
 * Compiles all of the app's js into a single, minified asset in `dist`, which includes pre-cached templates.
 */
gulp.task('build-js', function () {
	return jsResources(true)
		.pipe(concat(config.outputFiles.app.js))
		.pipe(rev())
		.pipe(gulp.dest(config.paths.dist))
		.pipe(rev.manifest({path: config.outputFiles.app.rev.js}))
		.pipe(gulp.dest(config.paths.rev));
});

/**
 * Compiles all of the app's less files into a single, minified css asset in `dist`.
 */
gulp.task('build-less', function () {
	return cssResources(true)
		.pipe(concat(config.outputFiles.app.css))
		.pipe(rev())
		.pipe(gulp.dest(config.paths.dist))
		.pipe(rev.manifest({path: config.outputFiles.app.rev.css}))
		.pipe(gulp.dest(config.paths.rev));
});

/**
 * Compiles all of the app's dependencies and writes them to `dist`.
 *
 * This will produce a single js file containing all concatenated scripts and a single css file containing all
 * concatenated stylesheets. Neither file is minified, as it is presumed that they are supplied in minified form.
 *
 * If there are any dependency files of types other than js or css, they'll be copied as-is to `dist`.
 */
gulp.task('build-deps', function () {
	var jsFilter = filter(config.filePatterns.js.all);
	var cssFilter = filter(config.filePatterns.css.all);

	// Base path must be specified explicitly or the process of including and excluding files via a filter results in
	// absolute file paths being written to the rev manifest rather than relative ones.
	return gulp.src(bower(), {base: config.paths.bower})
		.pipe(jsFilter)
		.pipe(concat(config.outputFiles.deps.js))
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe(concat(config.outputFiles.deps.css))
		.pipe(cssFilter.restore())
		.pipe(rev())
		.pipe(gulp.dest(config.paths.dist))
		.pipe(rev.manifest({path: config.outputFiles.deps.rev}))
		.pipe(gulp.dest(config.paths.rev));
});

/**
 * Injects the index file with script and stylesheet references and writes it to `dist`.
 */
gulp.task('build-html', function () {
	return es.merge(indexFile(), gulp.src(path.join(config.paths.rev, config.filePatterns.rev.all)))
		.pipe(revCollector())
		.pipe(gulp.dest(config.paths.dist));
});

/**
 * Copies assets not processed by the `build-*` tasks into `dist`.
 */
gulp.task('copy-assets', function () {
	gulp.src(path.join(config.paths.src, '**/*'))
		.pipe(filter([
			'**/*.*', // *.* pattern excludes empty directories
			'!' + config.filePatterns.html.all,
			'!' + config.filePatterns.js.all,
			'!' + config.filePatterns.less.all
		]))
		.pipe(gulp.dest(config.paths.dist));
});

/**
 * Performs a full build.
 */
gulp.task('build', function (cb) {
	sequence('clean', 'lint', 'test', ['build-js', 'build-less', 'build-deps'], ['build-html', 'copy-assets'], cb);
});

/**
 * Performs a full build.
 */
gulp.task('default', ['build']);

module.exports = {
	config: config
};
