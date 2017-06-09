'use strict';

const chalk = require('chalk');

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let Platform = function() {
    this.electronPackager;

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          let action = args.shift();
          let platform = args.shift() || process.platform;

          if (this[`${action}Platform`]) {
            this[`${action}Platform`](platform)
            .then((success) => {
              if (success) {
                this.cliOptions.verbose && console.log(chalk.green(success));
              };
              return resolve(messages.done.command.platform);
            }, (error) => {
              if (error) {
                console.log(chalk.red(error));
              };
              return reject(messages.error.command.platform);
            });
          } else {
            console.log(chalk.red(messages.error.action.invalid));
            return reject(messages.error.command.platform);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          return reject(messages.error.command.platform);
        }
      });
    };

    this.addPlatform = function(platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        return reject(messages.error.action.notImplemented);
      });
    };

    this.removePlatform = function(platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        return reject(messages.error.action.notImplemented);
      });
    };
  };

  Platform.prototype = command;

  return new Platform();
})();
