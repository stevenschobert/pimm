(function() {
  'use strict';

  var Controller = require('../../').Controller,
      util = require('util'),
      HomeController = function HomeController() {};

  util.inherits(HomeController, Controller);

  HomeController.prototype.index = function index(request) {
    return 'hello world';
  };

  module.exports = HomeController;
}());
