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
                console.log(chalk.green(success));
              }
              this[`${platform}Compile`]().then((success) => {
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

      console.log(chalk.grey(messages.info.packager.loading));

      return new Promise((resolve, reject) => {
        try {
          var electronPackagerPath = this.getAbsolutePathTo(`node_modules/electron-packager`);
          if (electronPackagerPath) {
            try {
              this.electronPackager = require(electronPackagerPath);
              resolve(messages.done.packager.loaded);
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

    this.compilePlatform = function(platform, options) {
      var options = options || {};
      return new Promise((resolve, reject) => {
        var sourceDirectory = this.getAbsolutePathTo(`platforms/${platform}/platform_app`);

        if (!sourceDirectory) {
          console.log(chalk.red(messages.error.directory.resolve.replace(/%s/g, sourceDirectory)));
          reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
          return;
        };

        var outputDirectory = this.getAbsolutePathTo(`platforms/${platform}/build`);

        if (!outputDirectory) {
          console.log(chalk.red(messages.error.directory.resolve.replace(/%s/g, sourceDirectory)));
          reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
          return;
        };

        // Target platform
        options.platform = `${platform}`;
        // Source directory.
        options.dir = sourceDirectory;
        // Target directory
        options.out = outputDirectory;

        var spinner = ora({
          text: chalk.gray(messages.info.packager.building.replace(/%s/g, `${platform}`)),
          spinner: 'pong',
          color: 'grey'
        });

        spinner.start();

        this.electronPackager(options, (error, success) => {
          if (error) {
            spinner.fail(chalk.red(messages.info.packager.building.replace(/%s/g, `${platform}`)));
            if (error.message) {
              console.log(chalk.red(error.message));
            } else {
               console.log(chalk.red(error));
            }
            reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
          } else {
            spinner.succeed(chalk.green(messages.info.packager.building.replace(/%s/g, `${platform}`)));
            resolve(messages.done.packager.built.replace(/%s/g, `${platform}`));
          };
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