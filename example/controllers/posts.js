(function() {
  'use strict';

  var PostsController = function PostsController() {};

  /**
   * Controller methods are organized as prototype functions.
   * The function names (index/show/update) are automatically
   * get to their correct CRUD paths by the Pimm router.
   */
  PostsController.prototype.index = function index(request) {
    var posts = [
      {title: 'Hello world!'},
      {title: 'This is my blog'}
    ];

    /**
     * Pimm lets us quickly render out views without worrying
     * about loading that view file, or specify things like
     * templating language, etc.
     */
    return this.render('posts/index', { posts: posts });
  };

  module.exports = PostsController;
}());
