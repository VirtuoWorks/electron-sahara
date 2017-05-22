'use strict';

const path = require('path');

const chalk = require('chalk');

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Compile = function(){

    this.electronPackager;

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          var platform = args.shift() || process.platform;

          if (this[`${platform}Compile`]) {
            this.requireElectronPackager().then((success) => {
              if (success) {
                console.log(chalk.green(success));
              }
              this[`${platform}Compile`](platform).then((success) => {
                if (success) {
                  console.log(chalk.green(success));
                };
                resolve(messages.done.command.compile);
              }, (error) => {
                if (error) {
                  console.log(chalk.red(error));
                };
                reject(messages.error.command.compile);
              });
            }, (error) => {
              if (error) {
                console.log(chalk.red(error));
              };
              reject(messages.error.command.compile);
            });
          } else {
            console.log(chalk.red(messages.error.action.invalid));
            reject(messages.error.command.compile);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.compile);
        }
      });
    };

    this.requireElectronPackager = function() {
      return new Promise((resolve, reject) => {
        try {
          var electronPackagerPath = path.resolve(path.normalize(`${this.workingDirectory}${path.sep}node_modules${path.sep}electron-packager`));
          var electronPackagerResolved = require.resolve(electronPackagerPath);
          if (electronPackagerResolved) {
            try {
              this.electronPackager = require(electronPackagerResolved);
              resolve(messages.info.packager.loaded);
            } catch (error) {
              reject(messages.error.packager.require);
            };
          } else {
            reject(messages.error.packager.resolve);
          };
        } catch (error) {
          reject(messages.error.packager.resolve);
        };
      });
    };

    this.win32Compile = function(platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

    this.darwinCompile = function() {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

    this.linuxCompile = function() {
      return new Promise((resolve, reject) => {
        // TODO !!!
        reject(messages.error.action.notImplemented);
      });
    };

  };

  Compile.prototype = command;

  return new Compile();
})();