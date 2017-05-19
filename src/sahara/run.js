'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Run = function(){
    
  };

  Run.prototype = command;

  return new Run();
})();