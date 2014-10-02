(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),
      path = require('path'),

      ViewManager = require('../../lib/pimm/view_manager');

  describe('ViewManager', function() {
    var vm;

    beforeEach(function(done) {
      vm = new ViewManager({dir: path.resolve(__dirname, '../fixtures/views')});
      vm.sharedData.message = 'test shared message!';
      vm.load()
      .then(function() {
        done();
      })
      .catch(done);
    });

    describe('#load', function() {
      it('should load views from the directory', function() {
        assert(!_.isEmpty(vm.views));
      });

      it('should use the path as the key name', function() {
        assert(_.has(vm.views, 'home/index'));
      });

      it('should add the full path', function() {
        assert.equal(path.resolve(__dirname, '../fixtures/views/home/index.jade'), vm.views['home/index'].path);
      });

      it('should have a render function', function() {
        assert(_.isFunction(vm.views['home/index'].render));
      });

      it('should render data for a view', function(done) {
        vm.views['home/index'].render({message: 'Test message!'})
        .then(function(data) {
          assert.equal('<p>Test message!</p>', data);
          done();
        })
        .catch(done);
      });

      it('should have access to shared data', function(done) {
        vm.views['home/index'].render()
        .then(function(data) {
          assert.equal('<p>test shared message!</p>', data);
          done();
        })
        .catch(done);
      });
    });

    describe('#rendererForSignature', function() {
      it('should return the function for the key name', function() {
        assert.equal(vm.rendererForSignature('home/index'), vm.views['home/index'].render);
      });
    });
  });
}());
