(function() {
  'use strict';

  var Controller = require('../../').Controller,
      util = require('util'),
      PostsController = function PostsController() {};

  util.inherits(PostsController, Controller);

  PostsController.prototype.index = function index(request) {
    var posts = [
      {title: 'Hello world!'},
      {title: 'This is my blog'}
    ];

    return this.render('posts/index', { posts: posts });
  };

  module.exports = PostsController;
}());
