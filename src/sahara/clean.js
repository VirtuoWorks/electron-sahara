'use strict';

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function(){

  var Clean = function(){
    
  };

  Clean.prototype = command;

  return new Clean();
})();