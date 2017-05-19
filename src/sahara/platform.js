'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Platform = function(){
    
  };

  Platform.prototype = command;

  return new Platform();
})();