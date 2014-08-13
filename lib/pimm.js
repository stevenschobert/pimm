(function() {
  'use strict';

  var keylime = require('keylime'),
      mach = require('mach'),
      _ = require('lodash'),
      p = require('path'),
      Promise = require('bluebird'),

      Path = require('./pimm/support/path'),
      Controller = require('./pimm/controller'),
      ControllerManager = require('./pimm/controller_manager'),
      ViewManager = require('./pimm/view_manager'),
      Router = require('./pimm/router'),

      Pimm = keylime('Pimm');

  Pimm
    .attr('dir', '.' + p.sep)
    .attr('port', 3000)
    .attr('templating', 'jade')
    .attr('middleware', [])

    .attr('_stack', mach.stack)
    .attr('_default_middleware', [mach.logger, mach.params])
    .attr('_controller_manager', ControllerManager)
    .attr('_view_manager', ViewManager)
    .attr('_router', Router)
    .attr('_config', {})

    /**
     * Interface to a generic configuration storage. Pimm does not use
     * this config interface for determining behavior, but you can use
     * it for storing global configuration values.
     *
     *    // main application.js file
     *    app
     *      .config('redis', {host: 'localhost'})
     *      .config('debug', true);
     *
     *    // some other module.js
     *    var app = require('./application');
     *
     *    app.config('redis');   // => gets the redis conf
     *    app.config();          // => gets all config
     */
    .method('config', function config() {
      var args = [].slice.call(arguments);

      switch (_.size(args)) {
        case 2:
          this._config[args[0]] = args[1];
          return this;
        case 1:
          return this._config[args[0]];
        default:
          return this._config;
      }
    })

    /**
     * Adds middleware to the stack (chainable);
     *
     *    app
     *      .use(someExternalMiddleware())
     *      .use(function(request) {
     *        if (request['x-auth-token']) {
     *          // check user
     *        }
     *      });
     */
    .method('use', function use(middleware) {
      if (!_.isFunction(middleware)) {
        throw new Error('You must supply a function argument to the \'use\' method.');
      }
      this.middleware.push(middleware);
      return this;
    })

    /**
     * Add routes to the Pimm application. Use the `this` keyword
     * inside the function to add routes.
     *
     * (See router.js to see what routing methods are available)
     *
     *    app.routes(function() {
     *      this.resources('posts');
     *
     *      this.namespace('admin', function() {
     *        this.resources('users');
     *      });
     *    });
     */
    .method('routes', function routes(func) {
      if (_.isFunction(func)) {
        func.call(this._router);
      }
      return this;
    })

    /**
     * Starts the application.
     *
     *    app.start().then(function() {
     *      console.log('App started!');
     *    });
     */
    .method('start', function start() {
      return Promise.all([this._loadControllers(), this._loadViews()])
      .bind(this)
      .then(function() {
        this._loadMiddleware();
        this._normalizeRoutes();
        this._activateRoutes();
        mach.serve(this._stack, this.port);
        return true;
      });
    })

    /**
     * Adds and queued up middleware to the mach stack.
     */
    .method('_loadMiddleware', function loadMiddleware() {
      _.each(_.flatten([this._default_middleware, this.middleware]), function(middleware) {
        this._stack.use(middleware);
      }, this);
    })

    /**
     * Delegates to the controller manager for loading up
     * controllers and mapping them to signatures for routing.
     */
    .method('_loadControllers', function loadControllers() {
      var controllerPath = new Path({value: this.dir}).resolve('controllers');

      this._controller_manager.dir = controllerPath;
      this._controller_manager._view_manager = this._view_manager;
      return this._controller_manager.load()
      .catch(function checkError(e) {
        return _.contains(e.message, 'ENOENT');
      }, function logError(e) {
        console.log('>> WARNING: No controllers directory found '+e.cause.path);
      });
    })

    /**
     * Delegates to the view manager for loading up views.
     */
    .method('_loadViews', function loadViews() {
      var viewPath = new Path({value: this.dir}).resolve('views');

      this._view_manager.engine = this.templating;
      this._view_manager.dir = viewPath;
      return this._view_manager.load()
      .catch(function checkError(e) {
        return _.contains(e.message, 'ENOENT');
      }, function logError(e) {
        console.log('>> WARNING: No views directory found '+e.cause.path);
      });
    })

    /**
     * Removes any routes that don't have real controller
     * methods backing them up.
     */
    .method('_normalizeRoutes', function normalizeRoutes() {
      this._router.routes = _.filter(this._router.routes, function checkRoute(route) {
        return _.isFunction(this._controller_manager.methodForSignature(route.action));
      }, this);
    })

    /**
     * Maps all the routes to controller handlers.
     */
    .method('_activateRoutes', function activateRoutes() {
      _.each(this._router.routes, function activateRoute(route) {
        var handler = this._controller_manager.methodForSignature(route.action);
        this._stack[route.method](route.path, handler);
      }, this);
    });

  module.exports = Pimm;
  module.exports.Controller = Controller;
}());
