'use strict';

var angular = require('angular');

module.exports = angular.module('fish', [])
	.controller('FishCtrl', require('./FishCtrl'));
