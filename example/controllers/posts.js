'use strict';

/**
 * In Pimm, controllers are nothing more than classes
 * you expose as a module. Pimm controllers also include
 * helper methods for rendering data and views.
 */
class PostsController {
  /**
   * Controller methods are organized as prototype functions.
   * The function names (index/show/update) are automatically
   * get to their correct CRUD paths by the Pimm router.
   */
  index(conn) {
    const posts = [
      {title: 'Hello world!'},
      {title: 'This is my blog'}
    ];

    /**
     * Pimm lets us quickly render out views without worrying
     * about loading that view file, or specify things like
     * templating language, etc.
     */
    return conn.render('posts/index', { posts: posts });
  }
};

module.exports = PostsController;
