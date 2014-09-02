(function() {
  'use strict';

  /**
   * In Pimm, controllers are nothing more than classes
   * you expose as a module. Pimm controllers also include
   * helper methods for rendering data and views.
   */
  var PostsController = function PostsController() {
    /**
     * Easily run filters before controller actions.
     * If the filter function returns a value, the
     * underlying controller method will not get invoked.
     */
    this.before('index', function beforeIndex(request) {
      /**
       * Here you can easily modify the request object,
       * or even return a response early, for example if you
       * want to require authentication.
       */
    });
  };

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
