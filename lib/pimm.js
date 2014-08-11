(function() {
  'use strict';

  var keylime = require('keylime'),
      mach = require('mach'),
      _ = require('lodash'),
      p = require('path'),
      Promise = require('bluebird'),

      Directory = require('./pimm/support/directory'),
      Path = require('./pimm/support/path'),
      Controller = require('./pimm/controller'),
      MethodMapper = require('./pimm/support/method_mapper'),

      Pimm = keylime('Pimm');

  Pimm
    .attr('dir', '.' + p.sep)
    .attr('port', 3000)

    .attr('_stack', mach.stack)
    .attr('_config', {
      environment: process.env.NODE_ENV
    })

    .method('config', function config() {
      var args = [].slice.call(arguments);

      switch (_.size(args)) {
        case 2:
          this._config[args[0]] = args[1];
          return this;
        case 1:
          return this._config[args[0]];
        default:
          return this._config;
      }
    })

    .method('_loadControllers', function loadControllers() {
      var controllerPath = new Path({value: this.dir}).resolve('controllers'),
          controllerDir = new Directory({path: controllerPath});

      return Promise.bind(this)
      .then(function() {
        return controllerDir.load();
      })
      .then(function() {
        _.forIn(controllerDir.files, function(Controller, path) {
          var controller = new Controller(),
              partialPath = new Path({value: path}).withoutExtension(),
              subRoute = _.first(_.at(partialPath, 0)) === '.' ? _.rest(partialPath).join('') : partialPath,
              mapper = new MethodMapper({methods: controller._getMethods()}).map();
          this._stack.map(subRoute, function(app) {
            app.run(mapper.stack);
          });
        }, this);
      });
    })

    .method('start', function start() {
      return this._loadControllers()
      .then(function() {
        mach.serve(this._stack, this.port);
        return true;
      });
    });

  module.exports = Pimm;
  module.exports.Controller = Controller;
}());
