// Karma configuration
// Generated on Mon Oct 13 2014 21:43:18 GMT-0700 (PDT)

var fs = require('fs');
var path = require('path');
var blibs = require('browser-libs');
var wrap = require('gulp-wrap-js');
var rename = require('gulp-rename');
var ngTplCache = require('gulp-angular-templatecache');
var sourcemaps = require('gulp-sourcemaps');
var build = require('./gulpfile.js');

module.exports = function (config) {
    var fileWrapper = fs.readFileSync(
        path.join(build.config.paths.src, build.config.filePatterns.js.fileWrapper)).toString();

    /* @type string[] Client-side libraries */
    var libraries = blibs();

    // gulpfile.js exports its configuration, which is leveraged here so file patterns don't have to be repeated (so
    // things won't break so easily if they change).
    config.set({
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'vinyl-streams', 'source-map-support'],

        // list of files / patterns to load in the browser
        files: libraries
            .concat(build.config.project.testDependencies)
            .concat([]
                .concat(build.config.filePatterns.js.sorted)
                .concat(build.config.filePatterns.html.all)
                .map(function (pattern) {
                    return path.join(build.config.paths.src, pattern);
                })),

        // list of files to exclude
        exclude: [
            path.join(build.config.paths.src, build.config.outputFiles.app.index) // index.html
        ],

        autoWatchBatchDelay: 0,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        vinylStreams: function (src, dest) {
            src.modified(build.config.filePatterns.js.all)
                .pipe(sourcemaps.init())
                .pipe(wrap(fileWrapper))
                .pipe(sourcemaps.write({sourceRoot: __dirname}))
                .pipe(dest());

            src.modified(build.config.filePatterns.html.all)
                .pipe(ngTplCache({module: build.config.project.templateCacheModule, standalone: true}))
                .pipe(rename({extname: '.js'}))
                .pipe(dest());

            src.modified(libraries)
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(sourcemaps.write({sourceRoot: __dirname}))
                .pipe(dest());
        }
    });
};
