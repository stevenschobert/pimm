(function() {
  'use strict';

  var keylime = require('keylime'),
      _ = require('lodash'),
      cons = require('consolidate'),
      Promise = require('bluebird'),

      Path = require('./support/path'),
      Directory = require('./support/directory'),

      ViewManager = keylime('ViewManager');

  Promise.promisifyAll(cons);
  cons['haml-coffeeAsync'] = Promise.promisify(cons['haml-coffee']);

  ViewManager
    .attr('dir')
    .attr('engine', 'jade')
    .attr('caching', false)
    .attr('sharedData', {})
    .attr('views', {})

    .method('load', function load() {
      var dirPath = new Path({value: this.dir}),
          dir = new Directory({path: dirPath.resolve()});

      return dir.load().bind(this)
      .then(function() {
        _.forIn(dir.files, function processFile(file, path) {
          var filePath = new Path({value: path}),
              keyName = new Path({value: filePath.withoutExtension()}).withoutPrefix(),
              fullPath = dirPath.resolve(path);
          this.views[keyName] = {path: fullPath};
          this.views[keyName].render = _.bind(this._render, this, fullPath);
        }, this);
        return this;
      });
    })

    /**
     * Returns a render method for a view "signature". The signature
     * is the file path without extension or prefix.
     *
     *    vm.rendererForSignature('home/index');
     */
    .method('rendererForSignature', function rendererForSignature(sig) {
      var view = this.views[sig],
          renderer = _.isPlainObject(view) ? view.render : null;
      return renderer;
    })

    .method('_render', function render(path, options) {
      var caching = this.caching,
          locals = _.extend({cache: caching}, options || {});
      _.defaults(locals, this.sharedData);
      return cons[this.engine+'Async'](path, locals).bind(this);
    });

  module.exports = ViewManager;
}());
