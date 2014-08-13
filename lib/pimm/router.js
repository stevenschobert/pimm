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
    });

  module.exports = Router;
}());
