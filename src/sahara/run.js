'use strict';

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let Run = function() {

  };

  Run.prototype = command;

  return new Run();
}());
