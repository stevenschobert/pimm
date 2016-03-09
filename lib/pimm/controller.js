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
      var handlers = _.filter(METHOD_NAMES, function(name) {
            return _.isFunction(this[name]);
          }, this);
      return _.reduce(handlers, function(acc, func) {
        acc[func] = this[func].bind(this);
        return acc;
      }, {}, this);
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
          return _.isUndefined(val) ? orig.apply(this, args) : val;
        }, this));
      }, this);

      return this;
    });

  module.exports = Controller;
}());
