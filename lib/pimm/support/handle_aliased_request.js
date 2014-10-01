(function() {

  var mach = require('mach');
  var _ = require('lodash');

  module.exports = function handleAliasedRequest(oldPath, newPath, type, request) {
    var status = (type === 'permanent') ? 301 : 302;
    var pathKeys = [];
    var newRedirect = newPath;
    var pathTester = mach.utils.compileRoute(oldPath, pathKeys);
    var matches;

    if ((matches = pathTester.exec(request.path)) !== null) {
      _.forEach(pathKeys, function mapPathKey(key, index) {
        newRedirect = newRedirect.replace(':'+key, matches[index+1]);
      });
      return mach.redirect(newRedirect, status);
    }
  };
}());
