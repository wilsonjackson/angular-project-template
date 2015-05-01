/**
 * @fileoverview Defines a task to launch a server using production assets.
 */

'use strict';

var connect = require('gulp-connect');

module.exports = function (config) {
    /**
     * Launches a web server using the contents of `dist` as the document root.
     *
     * This is useful for testing production assets.
     */
    return function () {
        connect.server({
            root: config.paths.dist,
            port: config.server.port
        });
    };
};
