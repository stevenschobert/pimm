(function() {
  'use strict';

  var assert = require('assert');
  var _ = require('lodash');

  var connectionHandler = require('../../../lib/pimm/support/connection_handler');

  describe('connectionHandler', function() {
    it("invokes the passed in function", function() {
      var called = 0;
      var method = function() { ++called; };

      connectionHandler(null, method);
      assert.equal(called, 1);
    });

    it("passes the original arguments to the function", function() {
      var first;
      var last;
      var method = function(f, l) {
        first = f;
        last = l;
      };

      connectionHandler(null, method, "test", 2);
      assert.equal(first, "test");
      assert.equal(last, 2);
    });

    it("assigns the controller to the first argument", function() {
      var controller = 1;
      var capture = null;
      var method = function(first) {
        capture = first;
      };

      connectionHandler(controller, method, {});
      assert.equal(capture._controller, controller);
    });
  });
}());
