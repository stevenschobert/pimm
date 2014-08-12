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

    describe('#withoutPrefix', function() {
      it('should return the path without the prefix', function() {
        p.value = sep+'.'+sep+'1some'+sep+'path';
        assert.equal(p.withoutPrefix(), '1some'+sep+'path');
      });
    });
  });
}());
