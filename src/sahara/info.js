'use strict';

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let Info = function() {

  };

  Info.prototype = command;

  return new Info();
})();
