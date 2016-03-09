(function() {
  'use strict';

  var keylime = require('keylime'),
      mach = require('mach'),
      _ = require('lodash'),

      METHODS_MAP = {
        index: {
          method: 'get',
          path: '/'
        },
        show: {
          method: 'get',
          path: '/:id'
        },
        new: {
          method: 'get',
          path: '/new'
        },
        create: {
          method: 'post',
          path: '/'
        },
        destroy: {
          method: 'delete',
          path: '/:id'
        },
        edit: {
          method: 'get',
          path: '/:id/edit'
        },
        update: {
          method: 'patch',
          path: '/:id'
        },
        replace: {
          method: 'put',
          path: '/:id'
        }
      },

      MethodMapper = keylime('MethodMapper');

  MethodMapper
    .attr('basePath', '')
    .attr('stack', mach.stack)
    .attr('methods', {})

    .method('map', function map() {
      var methods = _.pick(this.methods, function(handler, method) {
            return _.has(METHODS_MAP, method) && _.isFunction(handler);
          });

      _.forIn(methods, _.bind(function(handler, method) {
        var map = METHODS_MAP[method],
            base = _.isString(this.basePath) ? this.basePath : '';
        this.stack[map.method].call(this.stack, base + map.path, handler);
      }, this));

      return this;
    });

  module.exports = MethodMapper;
}());
