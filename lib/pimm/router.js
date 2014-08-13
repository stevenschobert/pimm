(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),

      Router = keylime('Router');

  Router
    .attr('routes', [])

    .method('_setRoute', function setRoute(method, path, action) {
      this.routes.push({
        path: path,
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
      ], function(route) {
        this[route.call](['/', resource, route.suffix].join(''), [resource, '#', route.action].join(''));
      }, this);
    });

  module.exports = Router;
}());
