(function() {
  'use strict';

  var Controller = require('../../../../').Controller,
      util = require('util'),
      RoomController = function RoomController() {};

  util.inherits(RoomController, Controller);

  RoomController.prototype.index = function index() {
    return 'This is the index method';
  };

  module.exports = RoomController;
}());
