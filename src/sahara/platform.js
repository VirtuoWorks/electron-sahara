'use strict';

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Platform = function(){

    this.action;
    this.platform;
 
    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          this.action = args.shift();
          this.platform = args.shift() || process.platform;

          
      });
    };

  };

  Platform.prototype = command;

  return new Platform();
})();