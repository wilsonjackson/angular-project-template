'use strict';

var angular = require('angular');

module.exports = angular.module('fish', [])
	.constant('fishTpl', require('./fish-tpl.html'))
	.controller('FishCtrl', require('./FishCtrl'));
