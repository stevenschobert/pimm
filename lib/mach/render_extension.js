(function() {
  "use strict";

  var _ = require("lodash");
  var Promise = require("bluebird");

  module.exports = extension;

  function extension(mach) {
    Object.defineProperty(mach.Connection.prototype, "render", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: render
    });
  }

  function render(status, view, locals) {
    /*jshint validthis:true */
    var data = locals;
    var renderer;

    if (_.isNumber(status)) {
      this.status = status;
    } else {
      data = view;
      view = status;
    }

    if (!_.isObject(this._controller) || !_.isObject(this._controller._view_manager)) {
      return Promise.reject("Cannot render templates without a controller!");
    }

    renderer = this._controller._view_manager.rendererForSignature(view);

    if (!_.isFunction(renderer)) {
      return Promise.reject("Template not found "+view);
    }

    // TODO: pull content-type from file extension
    this.response.contentType = "text/html";
    data = _.extend({ conn: this }, data);

    return renderer(data).bind(this).then(function(content) {
      return this.html(content);
    });
  }

}());
