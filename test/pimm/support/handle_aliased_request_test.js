(function() {

  var assert = require('assert');
  var mach = require('mach');
  var _ = require('lodash');

  var handleAliasedRequest = require('../../../lib/pimm/support/handle_aliased_request');

  describe('handleAliasedRequest', function() {
    describe('if the route matches', function() {
      var conn;

      beforeEach(function() {
        conn = new mach.Connection();
        conn.path = '/old';
      });

      describe('with a \'permanent\' type', function() {
        it('should return a 301 status', function() {
          handleAliasedRequest('/old', '/new', 'permanent', conn);
          assert.equal(conn.status, 301);
        });
      });

      describe('with a \'temporary\' type', function() {
        it('should return a 302 status', function() {
          handleAliasedRequest('/old', '/new', 'temporary', conn);
          assert.equal(conn.status, 302);
        });
      });

      describe('with a plain route match', function() {
        it('should set the location to the new route', function() {
          handleAliasedRequest('/old', '/new', 'temporary', conn);
          assert.equal(conn.response.headers.Location, '/new');
        });
      });

      describe('with a pattern route match', function() {
        it('should set the location to the new route with the params included', function() {
          var conn = new mach.Connection();
          conn.path = '/posts/2';
          handleAliasedRequest('/posts/:id', '/writings/:id', 'temporary', conn);
          assert.equal(conn.response.headers.Location, '/writings/2');
        });
      });
    });

    describe('if the route does not match', function() {
      var conn;

      beforeEach(function() {
        conn = new mach.Connection();
        conn.path = '/nope';
      });

      it('should return 404', function() {
        handleAliasedRequest('/old', '/new', 'temporary', conn);
        assert.equal(conn.status, 404);
      });
    });
  });
}());
