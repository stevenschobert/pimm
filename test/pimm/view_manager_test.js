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
    });
  });
}());
