'use strict';

const chalk = require('chalk');

const prepare = require('./prepare');
const compile = require('./compile');
const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function(){

  var Build = function(){

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          var platform = args.shift() || process.platform;

          prepare.exec([platform]).then((success) => {
            if (success) {
              this.cliOptions.verbose && console.log(chalk.green(success));
            };
            compile.exec([platform]).then((success) => {
              if (success) {
                this.cliOptions.verbose && console.log(chalk.green(success));
              };
              resolve(messages.done.command.build);
            }, (error) => {
              if (error) {
                this.cliOptions.verbose && console.log(chalk.red(error));
              };
              reject(messages.error.command.build);
            });
          }, (error) => {
            if (error) {
              this.cliOptions.verbose && console.log(chalk.red(error));
            }
            reject(messages.error.command.build);
          });
        } else {
          this.cliOptions.verbose && console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.build);
        };
      });
    };
  };

  Build.prototype = command;

  return new Build();
})();