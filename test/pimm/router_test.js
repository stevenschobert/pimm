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
        assert(_.has(r.routes, '/profile'));
      });

      it('should set the method to get', function() {
        assert.equal(r.routes['/profile'].method, 'get');
      });

      it('should set the action', function() {
        assert.equal(r.routes['/profile'].action, 'users#show');
      });
    });

    describe('#post', function() {
      beforeEach(function() {
        r.post('/login', 'sessions#create');
      });

      it('should add a route', function() {
        assert(_.has(r.routes, '/login'));
      });

      it('should set the method to post', function() {
        assert.equal(r.routes['/login'].method, 'post');
      });

      it('should set the action', function() {
        assert.equal(r.routes['/login'].action, 'sessions#create');
      });
    });

    describe('#patch', function() {
      beforeEach(function() {
        r.patch('/profile', 'profile#update');
      });

      it('should add a route', function() {
        assert(_.has(r.routes, '/profile'));
      });

      it('should set the method to patch', function() {
        assert.equal(r.routes['/profile'].method, 'patch');
      });

      it('should set the action', function() {
        assert.equal(r.routes['/profile'].action, 'profile#update');
      });
    });

    describe('#put', function() {
      beforeEach(function() {
        r.put('/profile', 'profile#replace');
      });

      it('should add a route', function() {
        assert(_.has(r.routes, '/profile'));
      });

      it('should set the method to put', function() {
        assert.equal(r.routes['/profile'].method, 'put');
      });

      it('should set the action', function() {
        assert.equal(r.routes['/profile'].action, 'profile#replace');
      });
    });

    describe('#delete', function() {
      beforeEach(function() {
        r.delete('/profile', 'profile#delete');
      });

      it('should add a route', function() {
        assert(_.has(r.routes, '/profile'));
      });

      it('should set the method to delete', function() {
        assert.equal(r.routes['/profile'].method, 'delete');
      });

      it('should set the action', function() {
        assert.equal(r.routes['/profile'].action, 'profile#delete');
      });
    });
  });
}());
