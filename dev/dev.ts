/**
 * @fileoverview Augments the main app module to also bootstrap dev sources.
 */

// The main 'app' module is made to rely on the 'dev' module.
angular.module('app').requires.push('dev');

// The 'dev' module may independently rely on dev-only sub-modules.
angular.module('dev', []);
