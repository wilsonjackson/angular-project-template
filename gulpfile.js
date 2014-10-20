/**
 * @fileoverview Standard build file for an AngularJS-based SPA.
 * 
 * This file hosts configuration for all gulp tasks. The contents of the configuration should be limited to what would
 * normally be literals in the task definition (paths, urls, ports, etc.) and not anything behavior-related.
 *
 * Behavior should be implemented directly in tasks, not controlled via flags and settings. (Edit things! This is just
 * a template!) Tasks are defined in their own files in `gulp/tasks`.
 *
 * Configuration defined in this file is also exported to allow other node modules to import it (e.g., to share file
 * path defintions with `karma.conf.js`).
 */

'use strict';

var gulp = require('gulp');
var glob = require('glob');
var path = require('path');

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
		module: 'app',
		basedir: __dirname
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
		// Main application source root. All asset types are mixed together in src, and are differentiated at build
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
			entryPoint: 'app.js',
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

// If gulp is running, register tasks. Otherwise assume this file is being required by another script for its
// exported config.
if (path.basename(process.argv[1]) === 'gulp') {
	// All tasks are defined in 'gulp/tasks' and have a uniform structure: they export a function that takes the config
	// object as its only argument and returns an object with a task definition and a 'register' method.
	glob.sync('gulp/tasks/*.js').forEach(function (task) {
		require('./' + task)(config).register();
	});

	// Run the 'build' task when no specific task is specified.
	gulp.task('default', ['build']);
}

module.exports = {
	config: config
};
