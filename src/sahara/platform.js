'use strict';

const path = require('path');

const chalk = require('chalk');

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function(){

  var Platform = function(){

    this.electronPackager;

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          var action = args.shift();
          var platform = args.shift() || process.platform;

          if (this[`${action}Platform`]) {
            this[`${action}Platform`](platform).then((success) => {
              if (success) {
                this.cliOptions.verbose && console.log(chalk.green(success));
              };
              resolve(messages.done.command.platform);
            }, (error) => {
              if (error) {
                this.cliOptions.verbose && console.log(chalk.red(error));
              };
              reject(messages.error.command.platform);
            });
          } else {
            this.cliOptions.verbose && console.log(chalk.red(messages.error.action.invalid));
            reject(messages.error.command.platform);
          }
        } else {
          this.cliOptions.verbose && console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.platform);
        }
      });
    };

    this.addPlatform = function (platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

    this.removePlatform = function (platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };


  };

  Platform.prototype = command;

  return new Platform();
})();