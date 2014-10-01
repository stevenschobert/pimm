(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),
      handleAliasedRequest = require('./support/handle_aliased_request'),

      Router = keylime('Router');

  Router
    .attr('routes', [])

    .method('_setRoute', function setRoute(method, path, action) {
      var prefixed = this._prefixPath(path);

      this.routes.push({
        path: prefixed,
        method: method,
        action: action
      });
      return this;
    })

    .method('get', function get() {
      return _.partial(this._setRoute, 'get').apply(this, arguments);
    })

    .method('post', function post() {
      return _.partial(this._setRoute, 'post').apply(this, arguments);
    })

    .method('patch', function patch() {
      return _.partial(this._setRoute, 'patch').apply(this, arguments);
    })

    .method('put', function put() {
      return _.partial(this._setRoute, 'put').apply(this, arguments);
    })

    .method('delete', function put() {
      return _.partial(this._setRoute, 'delete').apply(this, arguments);
    })

    .method('resources', function resources(resource) {
      _.each([
        {call: 'get', action: 'index', suffix: ''},
        {call: 'get', action: 'show', suffix: '/:id'},
        {call: 'post', action: 'create', suffix: ''},
        {call: 'get', action: 'new', suffix: '/new'},
        {call: 'get', action: 'edit', suffix: '/:id/edit'},
        {call: 'delete', action: 'destroy', suffix: '/:id'},
        {call: 'patch', action: 'update', suffix: '/:id'},
        {call: 'put', action: 'replace', suffix: '/:id'}
      ], function mapResources(route) {
        this[route.call](['/', resource, route.suffix].join(''), [resource, '#', route.action].join(''));
      }, this);
    })

    .method('resource', function resource(res) {
      _.each([
        {call: 'get', action: 'show', suffix: ''},
        {call: 'post', action: 'create', suffix: ''},
        {call: 'get', action: 'new', suffix: '/new'},
        {call: 'get', action: 'edit', suffix: '/edit'},
        {call: 'delete', action: 'destroy', suffix: ''},
        {call: 'patch', action: 'update', suffix: ''},
        {call: 'put', action: 'replace', suffix: ''}
      ], function mapResource(route) {
        this[route.call](['/', res, route.suffix].join(''), [res, '#', route.action].join(''));
      }, this);
    })

    /**
     * Creates a namespaced set of routes. The function passed in will
     * auto-prefix all route methods with the namespace for both the
     * route and the action. Use `this` inside the function to add
     * namespaced routes
     *
     *    router.namespace('api', function() {
     *      this.resources('posts');
     *      this.resource('profile');
     *    });
     */
    .method('namespace', function namespace(prefix, func) {
      var newContext = {};

      _.each(['get', 'post', 'patch', 'put', 'delete', 'resources', 'resource'], function bindNamespacedMethods(method) {
        newContext[method] = _.wrap(prefix, _.bind(function wrappedMethod(prefix, route, action) {
          var newRoute = [prefix, '/', route].join(''),
              newAction = [prefix, '/', action].join(''),
              args = _.rest(arguments, 3);
          return _.partial(this[method], newRoute, newAction).apply(this, args);
        }, this));
      }, this);

      func.call(newContext);
    })

    /**
     * Aliases a route to a new route, with either a 301 or 302 redirect status.
     */
    .method('alias', function alias(oldPath, newPath, type) {
      type = _.isString(type) ? type : 'temporary';
      this.get(oldPath, _.partial(handleAliasedRequest, this._prefixPath(oldPath), this._prefixPath(newPath), type));
      return this;
    })

    .method('_prefixPath', function prefixPath(path) {
      return _.first(path) === '/' ? path : ['/', path].join('');
    });

  module.exports = Router;
}());
