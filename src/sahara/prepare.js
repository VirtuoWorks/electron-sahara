'use strict';

const chalk = require('chalk');

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Prepare = function(){

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          var platform = args.shift() || process.platform;

          if (this[`${platform}Prepare`]) {
            this[`${platform}Prepare`](platform).then((success) => {
              if (success) {
                console.log(chalk.green(success));
              };
              resolve(messages.done.command.prepare);
            }, (error) => {
              if (error) {
                console.log(chalk.red(error));
              };
              reject(messages.error.command.prepare);
            });
          } else {
            console.log(chalk.red(messages.error.action.invalid));
            reject(messages.error.command.prepare);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.prepare);
        }
      });
    };

    this.win32Prepare = function(platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

    this.darwinPrepare = function() {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

    this.linuxPrepare = function() {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

  };

  Prepare.prototype = command;

  return new Prepare();
})();