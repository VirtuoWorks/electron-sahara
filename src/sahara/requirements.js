'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Requirements = function(){
    
  };

  Requirements.prototype = command;

  return new Requirements();
})();