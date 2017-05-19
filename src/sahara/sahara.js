'use strict';

const messages = require('../messages/messages');

exports = module.exports = (function(){
  
  var sahara = function(){
    var Sahara = function(){
      this.saharaDirectory;
      this.workingDirectory;
    };

    Sahara.prototype.init = function() {
      this.saharaDirectory = __dirname;
      this.workingDirectory = process.cwd();

      return this;
    };
    
    Sahara.prototype.exec = function(args) {
      return new Promise((resolve, reject) => {
        reject(messages.error.command.notImplemented);
      });
    };

    return new Sahara();
  };

  var Command = function(){};

  Command.prototype = (function(){
    return sahara().init();
  })();

  return new Command();
})();