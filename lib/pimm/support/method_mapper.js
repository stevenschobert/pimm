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
        destroy: {
          method: 'delete',
          path: '/:id'
        },
        create: {
          method: 'post',
          path: '/'
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

      _.forIn(methods, function(handler, method) {
        var map = METHODS_MAP[method],
            base = _.isString(this.basePath) ? this.basePath : '';
        this.stack[map.method].call(this.stack, base + map.path, handler);
      }, this);

      return this;
    });

  module.exports = MethodMapper;
}());
