(function() {
  'use strict';

  var assert = require('assert'),
      _ = require('lodash'),

      Router = require('../../lib/pimm/router');

  describe('Router', function() {
    var r;

    beforeEach(function() {
      r = new Router();
    });

    describe('#get', function() {
      beforeEach(function() {
        r.get('/profile', 'users#show');
      });

      it('should add a route', function() {
        assert(!_.isEmpty(_.select(r.routes, {path: '/profile'})));
      });

      it('should set the method to get', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).method, 'get');
      });

      it('should set the action', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).action, 'users#show');
      });
    });

    describe('#post', function() {
      beforeEach(function() {
        r.post('/profile', 'users#create');
      });

      it('should add a route', function() {
        assert(!_.isEmpty(_.select(r.routes, {path: '/profile'})));
      });

      it('should set the method to post', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).method, 'post');
      });

      it('should set the action', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).action, 'users#create');
      });
    });

    describe('#patch', function() {
      beforeEach(function() {
        r.patch('/profile', 'users#update');
      });

      it('should add a route', function() {
        assert(!_.isEmpty(_.select(r.routes, {path: '/profile'})));
      });

      it('should set the method to patch', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).method, 'patch');
      });

      it('should set the action', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).action, 'users#update');
      });
    });

    describe('#put', function() {
      beforeEach(function() {
        r.put('/profile', 'users#replace');
      });

      it('should add a route', function() {
        assert(!_.isEmpty(_.select(r.routes, {path: '/profile'})));
      });

      it('should set the method to put', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).method, 'put');
      });

      it('should set the action', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).action, 'users#replace');
      });
    });

    describe('#delete', function() {
      beforeEach(function() {
        r.delete('/profile', 'users#destroy');
      });

      it('should add a route', function() {
        assert(!_.isEmpty(_.select(r.routes, {path: '/profile'})));
      });

      it('should set the method to delete', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).method, 'delete');
      });

      it('should set the action', function() {
        assert.equal(_.first(_.select(r.routes, {path: '/profile'})).action, 'users#destroy');
      });
    });
  });
}());
