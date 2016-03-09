(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),
      Promise = require('bluebird'),

      connectionHandler = require('./support/connection_handler'),

      Directory = require('./support/directory'),
      Path = require('./support/path'),
      BaseController = require('./controller'),

      ControllerManager = keylime('ControllerManager');

  ControllerManager
    .attr('dir')
    .attr('controllers', {})
    .attr('_view_manager')

    .method('load', function load() {
      var dirPath = new Path({value: this.dir}),
          dir = new Directory({path: dirPath.resolve()});

      return dir.load().bind(this)
      .then(function() {
        var controllers = _.reduce(dir.files, function filterFiles(acc, file, path) {
              var filePath = new Path({value: path});
              if (filePath.hasExtension('js')) {
                acc[path] = file;
              }
              return acc;
            }, {});

        _.forIn(controllers, _.bind(function mapControllerFile(Controller, path) {
          var filePath = new Path({value: path}),
              controllerName = new Path({value: filePath.withoutExtension()}).withoutPrefix(),
              controller = {};

          /**
           * Extend the controller's prototype with the
           * shared methods from the core Controller class
           */
          _.defaults(Controller.prototype, BaseController.prototype);

          /**
           * Create an instance of the controller
           */
          controller._instance = new Controller();

          if (_.isObject(this._view_manager)) {
            controller._instance._view_manager = this._view_manager;
          }

          this.controllers[controllerName] = controller;
          _.forIn(controller._instance._getMethods(), _.bind(function addSubKeys(handler, name) {
            controller[name] = handler.bind(controller._instance);
          }, this));
        }, this));

        return this;
      });
    })

    /**
     * Looks up a handler using a "signature" string. This signature string
     * takes the form of `controller/path#method`.
     *
     *    manager.methodForSignature('home#index');
     */
    .method('methodForSignature', function methodForSignature(sig) {
      var sigParts = _.isString(sig) ? sig.split('#') : sig,
          controller = this.controllers[_.first(sigParts)],
          method = _.isPlainObject(controller) ? controller[_.last(sigParts)] : null,
          wrapped = null;

      if (method) {
        wrapped = connectionHandler.bind(controller._instance, controller._instance, method);
      }

      return wrapped;
    });

  module.exports = ControllerManager;
}());
