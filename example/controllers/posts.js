(function() {
  'use strict';

  var Controller = require('../../').Controller,
      util = require('util'),
      PostsController = function PostsController() {};

  util.inherits(PostsController, Controller);

  PostsController.prototype.create = function create(request) {
    return this.json({test: true});
  };

  PostsController.prototype.index = function index(request) {
    return this.json([{all: true}]);
  };

  module.exports = PostsController;
}());
