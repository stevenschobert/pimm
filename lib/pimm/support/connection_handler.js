(function() {
  'use strict';

  var _ = require('lodash');

  module.exports = function connectionHandler() {
    var args = [].slice.call(arguments);
    var controller = args.shift();
    var handler = args.shift();
    var conn = _.first(args);

    if (_.isObject(conn)) {
      conn._controller = controller;
    }

    return handler.apply(controller, args);
  };
}());
