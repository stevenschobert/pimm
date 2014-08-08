(function() {
  'use strict';

  var keylime = require('keylime'),
      p = require('path'),
      _ = require('lodash'),

      Path = keylime('Path');

  Path
    .attr('value', '')

    .method('resolve', function resolve() {
      return p.resolve(_.partial(p.join, this.value).apply(this, arguments));
    })

    .method('relative', function relative() {
      var from = '.' + p.sep,
          prefix = '.' + p.sep;
      return prefix + p.relative(from, _.partial(p.join, this.value).apply(this, arguments));
    })

    .method('relativeFrom', function relativeFrom() {
      var prefix = '.' + p.sep,
          args = [].slice.call(arguments, 0, 1);
      return prefix + _.partialRight(p.relative, this.relative()).apply(this, args);
    })

    .method('extension', function extension() {
      return p.extname(this.value);
    })

    .method('hasExtension', function hasExtension(val) {
      return (new RegExp(val, 'i').test(this.extension()));
    });

  module.exports = Path;
}());
