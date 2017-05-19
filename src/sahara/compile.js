'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Compile = function(){
    
  };

  Compile.prototype = command;

  return new Compile();
})();