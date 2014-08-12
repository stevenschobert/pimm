(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),

      path = require('path'),
      ControllerManager = require('../../lib/pimm/controller_manager');

  describe('ControllerManager', function() {
    var cm;

    beforeEach(function() {
      cm = new ControllerManager({dir: path.resolve(__dirname, '../fixtures/controllers')});
    });

    describe('#load', function() {
      beforeEach(function(done) {
        cm.load().then(function() {
          done();
        }).catch(done);
      });

      it('should load controllers from the directory', function() {
        assert(!_.isEmpty(cm.controllers));
      });

      it('should use the file path as the controller name', function() {
        assert(_.has(cm.controllers, 'sub/room'));
      });

      it('should use the controllers methods as sub-keys', function() {
        assert(_.has(cm.controllers['sub/room'], 'index'));
        assert.equal(cm.controllers['sub/room'].index(), cm.controllers['sub/room']._instance.index());
      });
    });
  });
}());
