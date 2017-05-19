'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Prepare = function(){
    
  };

  Prepare.prototype = command;

  return new Prepare();
})();