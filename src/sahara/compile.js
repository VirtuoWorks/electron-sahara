'use strict';

const ora = require('ora');
const chalk = require('chalk');

const command = require('./sahara');
const messages = require('./sahara/messages');

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
                this.cliOptions.verbose && console.log(chalk.green(success));
              }
              this[`${platform}Compile`]().then((success) => {
                if (success) {
                  this.cliOptions.verbose && console.log(chalk.green(success));
                };
                resolve(messages.done.command.compile);
              }, (error) => {
                if (error) {
                  this.cliOptions.verbose && console.log(chalk.red(error));
                };
                reject(messages.error.command.compile);
              });
            }, (error) => {
              if (error) {
                this.cliOptions.verbose && console.log(chalk.red(error));
              };
              reject(messages.error.command.compile);
            });
          } else {
            this.cliOptions.verbose && console.log(chalk.red(messages.error.action.invalid));
            reject(messages.error.command.compile);
          }
        } else {
          this.cliOptions.verbose && console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.compile);
        }
      });
    };

    this.requireElectronPackager = function() {
      this.cliOptions.verbose && console.log(chalk.yellow(messages.info.packager.loading));

      return new Promise((resolve, reject) => {
        try {
          this.getAbsolutePathTo(`node_modules/electron-packager`).then((electronPackagerPath) => {
            try {
              this.electronPackager = require(electronPackagerPath);
              resolve(messages.done.packager.loaded);
            } catch (error) {
              reject(messages.error.packager.require);
            };
          }, (error) => {
            reject(messages.error.packager.resolve);
          });
        } catch (error) {
          reject(messages.error.packager.resolve);
        };
      });
    };

    this.compilePlatform = function(platform, options) {
      var options = options || {};
      return new Promise((resolve, reject) => {
        this.getAbsolutePathTo(`platforms/${platform}/platform_app`).then((sourceDirectory) => {
          this.getAbsolutePathTo(`platforms/${platform}/build`).then((outputDirectory) => {
            // Target platform
            options.platform = `${platform}`;
            // Source directory.
            options.dir = sourceDirectory;
            // Target directory
            options.out = outputDirectory;

            var spinner = ora({
              text: chalk.yellow(messages.info.packager.building.replace(/%s/g, `${platform}`)),
              spinner: 'pong',
              color: 'yellow'
            });

            spinner.start();

            this.electronPackager(options, (error, success) => {
              if (error) {
                spinner.fail(chalk.red(messages.info.packager.building.replace(/%s/g, `${platform}`)));
                if (error.message) {
                  this.cliOptions.verbose && console.log(chalk.red(error.message));
                } else {
                  this.cliOptions.verbose && console.log(chalk.red(error));
                }
                reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
              } else {
                spinner.succeed(chalk.green(messages.info.packager.building.replace(/%s/g, `${platform}`)));
                resolve(messages.done.packager.built.replace(/%s/g, `${platform}`));
              };
            });
          }, (error) => {
            this.cliOptions.verbose && console.log(chalk.red(error));
            reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
          });
        }, (error) => {
          this.cliOptions.verbose && console.log(chalk.red(error));
          reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
        });
      });
    };

    this.win32Compile = function() {
      return new Promise((resolve, reject) => {
        var options = {
          quiet:true,
          asar: true,
          arch: 'x64', 
          prune: true,
          overwrite: true
        };

        this.compilePlatform('win32', options).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    this.darwinCompile = function() {
      return new Promise((resolve, reject) => {
        var options = {
          quiet:true,
          asar: true,
          arch: 'x64', 
          prune: true,
          overwrite: true
        };

        this.compilePlatform('darwin', options).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    this.linuxCompile = function() {
      return new Promise((resolve, reject) => {
        var options = {
          quiet:true,
          asar: true,
          arch: 'x64', 
          prune: true,
          overwrite: true
        };

        this.compilePlatform('linux', options).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

  };

  Compile.prototype = command;

  return new Compile();
})();