(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),
      sep = require('path').sep,

      Path = require('../../../lib/pimm/support/path');

  describe('Path', function() {
    var p;

    beforeEach(function() {
      p = new Path();
    });

    describe('#extension', function() {
      it('should return the extension of the file', function() {
        p.value = './test.js';
        assert.equal(p.extension(), '.js');
      });
    });

    describe('#withoutExtension', function() {
      it('should return the path of the file without the extension', function() {
        p.value = './test.js';
        assert.equal(p.withoutExtension(), './test');
      });
    });

    describe('#hasExtension', function() {
      it('should return true if the extension matches', function() {
        p.value = './test.js';
        assert(p.hasExtension('js'));
      });

      it('should return false if the extension does not match', function() {
        p.value = './test.js';
        assert(!p.hasExtension('html'));
      });
    });

    describe('#withoutPrefix', function() {
      it('should return the path without the prefix', function() {
        p.value = sep+'.'+sep+'1some'+sep+'path';
        assert.equal(p.withoutPrefix(), '1some'+sep+'path');
      });
    });
  });
}());
