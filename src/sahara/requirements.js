'use strict';

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let Requirements = function() {

  };

  Requirements.prototype = command;

  return new Requirements();
}());
