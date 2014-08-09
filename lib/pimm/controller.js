(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),
      mach = require('mach'),

      Controller = keylime('Controller'),
      METHOD_NAMES = ['index'];

  Controller
    .method('_getMethods', function getMethods() {
      var handlers = _.filter(_.functions(this), function(func) {
            return _.contains(METHOD_NAMES, func);
          });
      return _.reduce(handlers, function(acc, func) {
        acc[func] = this[func].bind(this);
        return acc;
      }, {}, this);
    });

  // add response helper methods
  _.each(['send', 'text', 'html', 'json', 'redirect', 'back'], function mapResponseHelpers(func) {
    Controller.method(func, function() {
      return mach[func].apply(this, arguments);
    });
  });

  module.exports = Controller;
}());
