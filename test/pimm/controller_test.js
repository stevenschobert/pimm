(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),

      Controller = require('../../lib/pimm/controller');

  describe('Controller', function() {
    var c;

    beforeEach(function() {
      c = new Controller();
      c.index = function() {
        return 'index';
      };
      c.create = function() {
        return 'create';
      };
    });

    describe('#before', function() {
      it('should wrap a method', function() {
        var filter = function() {
          return 'filter';
        };
        c.before('index', filter);
        assert.equal(c.index(), 'filter');
      });

      it('should return the original method if the filter doesn\'t return', function() {
        var filter = function() {};
        c.before('index', filter);
        assert.equal(c.index(), 'index');
      });

      it('should wrap multiple methods using an array', function() {
        var filter = function() {
          return 'filter';
        };
        c.before(['index', 'create'], filter);
        assert.equal(c.index(), 'filter');
        assert.equal(c.create(), 'filter');
      });

      it('should wrap multiple methods using multiple args', function() {
        var filter = function() {
          return 'filter';
        };
        c.before('index', 'create', filter);
        assert.equal(c.index(), 'filter');
        assert.equal(c.create(), 'filter');
      });

      it('should pass arguments to the wrapped method', function() {
        var arg1,
            arg2,
            filter = function() {};
        c.index = function(a1, a2) {
          arg1 = a1;
          arg2 = a2;
        };
        c.before(filter, 'index');
        c.index('a', 'b');
        assert.equal(arg1, 'a');
        assert.equal(arg2, 'b');
      });
    });
  });
}());
