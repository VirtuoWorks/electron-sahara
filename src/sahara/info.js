'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Info = function(){
    
  };

  Info.prototype = command;

  return new Info();
})();