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
  });
}());
