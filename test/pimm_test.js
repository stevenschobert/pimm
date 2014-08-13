(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),

      Pimm = require('../');

  describe('Pimm instance', function() {
    var p;

    beforeEach(function() {
      p = new Pimm();
    });

    describe('#config', function() {
      describe('with no arguments', function() {
        it('should return the entire config object', function() {
          assert.equal(p.config(), p._config);
        });
      });

      describe('with a single argument', function() {
        it('should return a config variable', function() {
          p._config.testconf3 = 3;
          assert.equal(p.config('testconf3'), 3);
        });
      });

      describe('with two arguments', function() {
        it('should return the same instance', function() {
          assert.equal(p.config('test', true), p);
        });

        it('should set a config variable', function() {
          p.config('testconf', 2);
          assert.equal(p._config.testconf, 2);
        });
      });
    });

    describe('#use', function() {
      describe('with a non-function argument', function() {
        it('should throw an error', function() {
          assert.throws(p.use, /function.*use/i);
        });
      });

      describe('with a function argument', function() {
        it('should return the same instance', function() {
          assert.equal(p, p.use(function() {}));
        });

        it('should add a middleware to the stack', function() {
          var func = function() {};
          p.use(func);
          assert(_.contains(p.middleware, func));
        });
      });
    });

    describe('#routes', function() {
      it('should execute a function in the context of the router', function() {
        var context;
        p.routes(function() { context = this; });
        assert.equal(context, p._router);
      });

      it('should return the same instance for chaining', function() {
        assert.equal(p.routes(), p);
      });
    });
  });
}());
