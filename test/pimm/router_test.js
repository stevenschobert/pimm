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
        r.get('profile', 'users#show');
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
        r.post('profile', 'users#create');
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
        r.patch('profile', 'users#update');
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
        r.put('profile', 'users#replace');
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
        r.delete('profile', 'users#destroy');
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

    describe('#resources', function() {
      beforeEach(function() {
        r.resources('posts');
      });

      it('should add an index route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts',
          method: 'get',
          action: 'posts#index'
        })));
      });

      it('should add a create route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts',
          method: 'post',
          action: 'posts#create'
        })));
      });

      it('should add a \'new\' route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts/new',
          method: 'get',
          action: 'posts#new'
        })));
      });

      it('should add a show route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts/:id',
          method: 'get',
          action: 'posts#show'
        })));
      });

      it('should add an edit route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts/:id/edit',
          method: 'get',
          action: 'posts#edit'
        })));
      });

      it('should add a delete route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts/:id',
          method: 'delete',
          action: 'posts#destroy'
        })));
      });

      it('should add an update route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts/:id',
          method: 'patch',
          action: 'posts#update'
        })));
      });

      it('should add a replace route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/posts/:id',
          method: 'put',
          action: 'posts#replace'
        })));
      });
    });

    describe('#resource', function() {
      beforeEach(function() {
        r.resource('profile');
      });

      it('should add a \'new\' route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile/new',
          method: 'get',
          action: 'profile#new'
        })));
      });

      it('should add a create route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile',
          method: 'post',
          action: 'profile#create'
        })));
      });

      it('should add a show route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile',
          method: 'get',
          action: 'profile#show'
        })));
      });

      it('should add an edit route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile/edit',
          method: 'get',
          action: 'profile#edit'
        })));
      });

      it('should add an update route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile',
          method: 'patch',
          action: 'profile#update'
        })));
      });

      it('should add a replace route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile',
          method: 'put',
          action: 'profile#replace'
        })));
      });

      it('should add a destroy route', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/profile',
          method: 'delete',
          action: 'profile#destroy'
        })));
      });
    });

    describe('namespace', function() {
      beforeEach(function() {
        r.namespace('api', function() {
          this.get('profile', 'profile#show');
          this.resources('posts');
          this.resource('settings');
        });
      });

      it('should prefix all the methods with the namespace value', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/api/profile',
          method: 'get',
          action: 'api/profile#show'
        })));
      });

      it('should prefix resources with the namespace', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/api/posts',
          method: 'get',
          action: 'api/posts#index'
        })));
      });

      it('should prefix resource with the namespace', function() {
        assert(!_.isEmpty(_.select(r.routes, {
          path: '/api/settings/edit',
          method: 'get',
          action: 'api/settings#edit'
        })));
      });
    });
  });
}());
