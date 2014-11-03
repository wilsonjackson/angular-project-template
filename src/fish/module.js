'use strict';

var angular = require('angular');
var fs = require('fs');

module.exports = angular.module('fish', [])
	.constant('fishTpl', fs.readFileSync(__dirname + '/fish-tpl.html', 'utf-8'))
	.controller('FishCtrl', require('./FishCtrl'));
