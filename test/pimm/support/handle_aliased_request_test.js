(function() {

  var assert = require('assert');
  var _ = require('lodash');

  var handleAliasedRequest = require('../../../lib/pimm/support/handle_aliased_request');

  describe('handleAliasedRequest', function() {
    describe('if the route matches', function() {
      describe('with a \'permanent\' type', function() {
        it('should return a 301 status', function() {
          assert.equal(handleAliasedRequest('/old', '/new', 'permanent', {
            path: '/old'
          }).status, 301);
        });
      });

      describe('with a \'temporary\' type', function() {
        it('should return a 302 status', function() {
          assert.equal(handleAliasedRequest('/old', '/new', 'temporary', {
            path: '/old'
          }).status, 302);
        });
      });

      describe('with a plain route match', function() {
        it('should set the location to the new route', function() {
          assert.equal(handleAliasedRequest('/old', '/new', 'temporary', {
            path: '/old'
          }).headers.Location, '/new');
        });
      });

      describe('with a pattern route match', function() {
        it('should set the location to the new route with the params included', function() {
          assert.equal(handleAliasedRequest('/posts/:id', '/writings/:id', 'temporary', {
            path: '/posts/2'
          }).headers.Location, '/writings/2');
        });
      });
    });

    describe('if the route does not match', function() {
      it('should not return anything', function() {
        assert(_.isUndefined(handleAliasedRequest('/old', '/new', 'temporary', {
          path: '/nope'
        })));

        assert(_.isUndefined(handleAliasedRequest('/old/:id', '/new/:id', 'temporary', {
          path: '/old'
        })));
      });
    });
  });
}());
