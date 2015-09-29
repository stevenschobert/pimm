(function() {
  "use strict";

  var assert = require("assert");
  var _ = require("lodash");

  var renderExtension = require("../../lib/mach/render_extension");
  var mach = require("mach");

  describe("mach", function() {
    describe("renderExtension", function() {
      before(function() {
        mach.extend(renderExtension);
      });

      it("adds a 'render' function to mach.Connection.prototype", function() {
        assert(_.isFunction(mach.Connection.prototype.render));
      });
    });
  });

}());
