(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),
      mach = require('mach'),
      Promise = require('bluebird'),

      Controller = keylime('Controller'),
      METHOD_NAMES = ['index', 'new', 'create', 'show', 'destroy', 'edit', 'update', 'replace'];

  Controller
    .method('_getMethods', function getMethods() {
      var handlers = _.filter(_.functions(this), function(func) {
            return _.contains(METHOD_NAMES, func);
          });
      return _.reduce(handlers, function(acc, func) {
        acc[func] = this[func].bind(this);
        return acc;
      }, {}, this);
    })

    /**
     * Render a view from inside a controller. Can also supply a status
     * and headers, like other response helpers. Defaults to HTML.
     *
     *    HomeController.prototype.index = function() {
     *      return this.render('home/index', {message: 'Template data!'});
     *    };
     */
    .method('render', function render(view, data, status, headers) {
      if (!_.isObject(this._view_manager)) {
        return Promise.reject('Cannot render templates without a view manager!');
      }

      if (!_.isFunction(this._view_manager.rendererForSignature(view))) {
        return Promise.reject('Template not found '+view);
      }

      headers = headers || {};
      headers['Content-Type'] = headers['Content-Type'] || 'text/html';

      return this._view_manager.rendererForSignature(view)(data || {})
      .bind(this)
      .then(function(content) {
        return this.send(content, status, headers);
      });
    })

    /**
     * Wraps an instance method (or a collection of methods) in a "before" function
     * that will get invoked before the instance method(s).
     *
     * To enfore theses on a Class-level, add them to the Controller's constructor:
     *
     *    PostsController = function PostsController() {
     *      this.before('create', 'destroy', this.requireLogin);
     *    }
     */
    .method('before', function before() {
      var wrapper = _.last(arguments),
          methods = _.flatten(_.take(arguments, _.size(arguments) - 1));

      if (!_.isFunction(wrapper)) {
        return this;
      }

      _.each(methods, function wrapMethod(method) {
        if (!_.isFunction(this[method])) {
          return;
        }
        this[method] = _.wrap(this[method], _.bind(function wrappedMethod() {
          var orig = _.first(arguments),
              args = _.drop(arguments, 1),
              val = wrapper.apply(this, args);
          return val ? val : orig.apply(this, args);
        }, this));
      }, this);

      return this;
    });

  // add response helper methods
  _.each(['send', 'text', 'html', 'json', 'redirect', 'back'], function mapResponseHelpers(func) {
    Controller.method(func, function() {
      return mach[func].apply(this, arguments);
    });
  });

  module.exports = Controller;
}());
