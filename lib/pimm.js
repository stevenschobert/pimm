(function() {
  'use strict';

  var keylime = require('keylime'),
      mach = require('mach'),
      _ = require('lodash'),
      p = require('path'),
      Promise = require('bluebird'),

      Directory = require('./pimm/support/directory'),
      Path = require('./pimm/support/path'),
      Controller = require('./pimm/controller'),
      MethodMapper = require('./pimm/support/method_mapper'),
      Router = require('./pimm/router'),

      Pimm = keylime('Pimm');

  Pimm
    .attr('dir', '.' + p.sep)
    .attr('port', 3000)
    .attr('middleware', [])

    .attr('_stack', mach.stack)
    .attr('_default_middleware', [mach.logger, mach.params])
    .attr('_config', {
      environment: process.env.NODE_ENV
    })
    .attr('_router', Router)

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
      this._loadMiddleware();
      return this._loadControllers()
      .then(function() {

        mach.serve(this._stack, this.port);
        return true;
      });
    })

    .method('_loadMiddleware', function loadMiddleware() {
      _.each(_.flatten([this._default_middleware, this.middleware]), function(middleware) {
        this._stack.use(middleware);
      }, this);
    })

    .method('_loadControllers', function loadControllers() {
      var controllerPath = new Path({value: this.dir}).resolve('controllers'),
          controllerDir = new Directory({path: controllerPath});

      return Promise.bind(this)
      .then(function() {
        return controllerDir.load();
      })
      .then(function() {
        _.forIn(controllerDir.files, function(Controller, path) {
          var controller = new Controller(),
              partialPath = new Path({value: path}).withoutExtension(),
              subRoute = _.first(_.at(partialPath, 0)) === '.' ? _.rest(partialPath).join('') : partialPath,
              mapper = new MethodMapper({methods: controller._getMethods()}).map();
          this._stack.map(subRoute, function(app) {
            app.run(mapper.stack);
          });
        }, this);
      });
    });

  module.exports = Pimm;
  module.exports.Controller = Controller;
}());
