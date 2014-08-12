(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),
      Promise = require('bluebird'),

      Directory = require('./support/directory'),
      Path = require('./support/path'),

      ControllerManager = keylime('ControllerManager');

  ControllerManager
    .attr('dir')
    .attr('controllers', {})

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

        _.forIn(controllers, function mapControllerFile(Controller, path) {
          var filePath = new Path({value: path}),
              controllerName = new Path({value: filePath.withoutExtension()}).withoutPrefix(),
              controller = {
                _instance: new Controller()
              };

          this.controllers[controllerName] = controller;
          _.forIn(controller._instance._getMethods(), function addSubKeys(handler, name) {
            controller[name] = handler;
          }, this);
        }, this);

        return this;
      });
    });

  module.exports = ControllerManager;
}());
