(function() {
  'use strict';

  var keylime = require('keylime'),
      mach = require('mach'),
      _ = require('lodash'),
      p = require('path'),

      Directory = require('./pimm/support/directory'),
      Path = require('./pimm/support/path'),
      Controller = require('./pimm/controller'),

      Pimm = keylime('Pimm');

  Pimm
    .attr('dir', '.' + p.sep)
    .attr('port', 3000)

    .attr('_stack', mach.stack)

    .method('_loadControllers', function loadControllers() {
      var controllerPath = new Path({value: this.dir}).resolve('controllers'),
          controllerDir = new Directory({path: controllerPath});

      return controllerDir.load()
      .then(function() {
        _.forIn(controllerDir.files, function(Controller, path) {
          var controller = new Controller();
          console.log(controller._getHandlers());
        });
      });
    })

    .method('start', function start() {
      mach.serve(this._stack, this.port);
    });

  module.exports = Pimm;
  module.exports.Controller = Controller;
}());
