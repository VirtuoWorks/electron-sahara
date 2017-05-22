'use strict';

const ora = require('ora');
const chalk = require('chalk');
const ncp = require('ncp').ncp;

const command = require('./sahara');
const messages = require('../messages/messages');

exports = module.exports = (function(){

  var Prepare = function(){

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          var platform = args.shift() || process.platform;

          if (this[`${platform}Prepare`]) {
            var platformsAbsolutePath = this.getAbsolutePathTo(`platforms`);
            if (platformsAbsolutePath) {
              this.createDirectory(platformsAbsolutePath).then((success) => {
                if (success) {
                  console.log(chalk.green(success));
                };
                this[`${platform}Prepare`]().then((success) => {
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
              }, (error) => {
                if (error) {
                  console.log(chalk.red(error));
                };
                reject(messages.error.command.prepare);
              });
            } else {
              console.log(chalk.red(messages.error.directory.resolve.replace(/%s/g, platformsAbsolutePath)));
              reject(messages.error.command.prepare);
            }
          } else {
            console.log(chalk.red(messages.error.platform.invalid.replace(/%s/g, platform)));
            reject(messages.error.command.prepare);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.prepare);
        }
      });
    };

    this.preparePlatform = function(platform) {

      console.log(chalk.grey(messages.info.platform.prepare.replace(/%s/g, `${platform}`)));

      return new Promise((resolve, reject) => {
        if (platform && this[`${platform}Prepare`]) {

          var platformAbsolutePath = this.getAbsolutePathTo(`platforms/${platform}`);

          if (platformAbsolutePath) {
            this.deleteDirectory(platformAbsolutePath).then((success) => {
              this.createDirectory(platformAbsolutePath).then((success) => {
                console.log(chalk.green(success));
                var appAbsolutePath = this.getAbsolutePathTo(`app`);
                var platformAppAbsolutePath = this.getAbsolutePathTo(`platforms/${platform}/platform_app`);
                if (appAbsolutePath) {
                  if (platformAppAbsolutePath) {
                    var spinner = ora({
                      text: chalk.gray(messages.info.files.copy),
                      spinner: 'pong',
                      color: 'grey'
                    });

                    spinner.start();

                    ncp(appAbsolutePath, platformAppAbsolutePath, function (error) {
                      if (error) {
                        spinner.fail(chalk.red(messages.info.files.copy));
                        if (error) {
                          console.log(chalk.red(error));
                        };
                        reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                      } else {
                        spinner.succeed(chalk.green(messages.info.files.copy));
                        resolve(messages.done.platform.prepare.replace(/%s/g, `${platform}`));
                      };
                    });
                  } else {
                    console.log(chalk.red(messages.error.directory.resolve.replace(/%s/g, appAbsolutePath)));
                    reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                  };
                } else {
                  console.log(chalk.red(messages.error.directory.resolve.replace(/%s/g, appAbsolutePath)));
                  reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                }
              }, (error) => {
                if (error) {
                  console.log(chalk.red(error));
                };
                reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
              });
            }, (error) => {
              if (error) {
                console.log(chalk.red(error));
              };
              reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
            });
          } else {
            console.log(chalk.red(messages.error.directory.resolve.replace(/%s/g, platformAbsolutePath)));
            reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
          };
        } else {
          reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
        };
      });
    }

    this.win32Prepare = function(platform) {
      return new Promise((resolve, reject) => {
        this.preparePlatform('win32').then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    this.darwinPrepare = function() {
      return new Promise((resolve, reject) => {
        this.preparePlatform('darwin').then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    this.linuxPrepare = function() {
      return new Promise((resolve, reject) => {
        this.preparePlatform('linux').then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

  };

  Prepare.prototype = command;

  return new Prepare();
})();