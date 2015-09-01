(function() {

  var compileRoute = require('mach/modules/utils/compileRoute');
  var _ = require('lodash');

  module.exports = function handleAliasedRequest(oldPath, newPath, type, conn) {
    var status = (type === 'permanent') ? 301 : 302;
    var pathKeys = [];
    var newRedirect = newPath;
    var pathTester = compileRoute(oldPath, pathKeys);
    var matches;

    if ((matches = pathTester.exec(conn.path)) !== null) {
      _.forEach(pathKeys, function mapPathKey(key, index) {
        newRedirect = newRedirect.replace(':'+key, matches[index+1]);
      });
      return conn.redirect(status, newRedirect);
    }

    return conn.text(404, 'Not Found: ' + conn.method + ' ' + conn.path);
  };
}());
