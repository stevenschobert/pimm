(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),

      path = require('path'),
      ControllerManager = require('../../lib/pimm/controller_manager');

  describe('ControllerManager', function() {
    var cm;

    beforeEach(function(done) {
      cm = new ControllerManager({dir: path.resolve(__dirname, '../fixtures/controllers')});
      cm.load().then(function() {
        done();
      }).catch(done);
    });

    describe('#load', function() {
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

      it('should extend a controller\'s prototype with the base controllers methods', function() {
        assert(_.isFunction(Object.getPrototypeOf(cm.controllers['sub/room']._instance).before));
      });
    });

    describe('#methodForSignature', function() {
      it('should return the handler', function() {
        assert.equal(cm.methodForSignature('sub/room#index')(), cm.controllers['sub/room'].index());
      });

      it('should return null if the handler does not exist', function() {
        assert(_.isNull(cm.methodForSignature('test')));
      });
    });
  });
}());
