var build = require('./gulpfile');

exports.config = {
    // To use a persistent standalone selenium server, uncomment this:
    //seleniumAddress: 'http://localhost:4444/wd/hub',

    framework: 'mocha',

    baseUrl: 'http://localhost:' + build.config.server.devPort,

    specs: [
        'test/e2e/**/*.spec.js'
    ]
};
