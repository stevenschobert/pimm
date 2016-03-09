'use strict';

class ApiPostsController {
  constructor() {
    /**
     * Easily run filters before controller actions.
     * If the filter function returns a value, the
     * underlying controller method will not get invoked.
     * Here you can easily modify the connection object,
     * or even return a response early, for example if you
     * want to require authentication.
     */
    this.before('index', (conn) => {
      const auth = conn.auth.split(":");
      const username = auth[0];

       if (username !== "stevenschobert") {
        conn.text(401, 'unauthorized');

        /**
         * Explicitly returning false here will stop the controller
         * early, preventing it from hitting its underlying action
         */
        return false;
      }
    });
  }

  index(conn) {
    const posts = [
      {title: 'Hello world!'},
      {title: 'This is my blog'}
    ];

    return conn.json({ posts });
  }
}

module.exports = ApiPostsController;
