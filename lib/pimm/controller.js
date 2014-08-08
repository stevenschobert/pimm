(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),

      Controller = keylime('Controller'),

      METHOD_NAMES = ['index'];

  Controller
    .method('_getHandlers', function getHandlers() {
      var handlers = _.filter(_.functions(this), function(func) {
            return _.contains(METHOD_NAMES, func);
          });
      return _.reduce(handlers, function(acc, func) {
        acc[func] = this[func];
        return acc;
      }, {}, this);
    });

  module.exports = Controller;
}());
