'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Help = function(){
    
  };

  Help.prototype = command;

  return new Help();
})();