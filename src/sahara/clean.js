'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Clean = function(){
    
  };

  Clean.prototype = command;

  return new Clean();
})();