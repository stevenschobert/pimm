(function() {
  'use strict';

  var keylime = require('keylime'),
      Promise = require('bluebird'),
      fs = require('fs'),
      recursiveReaddir = require('recursive-readdir'),
      Path = require('./path'),
      readdir = Promise.promisify(recursiveReaddir),
      readfile = Promise.promisify(fs.readFile),

      Directory = keylime('Directory');

  Directory
    .attr('path', './')
    .attr('files', {})

    .method('load', function load() {
      var path = new Path({value: this.path});

      return Promise.bind(this)
      .then(function() {
        return readdir(path.resolve());
      })
      .map(function processFile(file) {
        var filePath = new Path({value: file}),
            filePiece = filePath.relativeFrom(this.path),
            fileContent = (filePath.hasExtension('js')) ? require(filePath.resolve()) : readfile(filePath.resolve());
        return Promise.join(filePiece, fileContent, function(name, content) {
          return {
            name: name,
            content: content
          };
        });
      })
      .each(function populateFile(file) {
        this.files[file.name] = file.content;
      });
    });

  module.exports = Directory;
}());
