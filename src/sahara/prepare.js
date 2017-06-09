'use strict';

const ora = require('ora');
const chalk = require('chalk');
const ncp = require('ncp').ncp;

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let Prepare = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (!!this.settings) {
            let platform = args.shift() || process.platform;

            if (this[`${platform}Prepare`]) {
              this.getAbsolutePathTo(`platforms`)
              .then((platformsAbsolutePath) => {
                this.createDirectory(platformsAbsolutePath)
                .then((success) => {
                  if (success) {
                    this.cliOptions.verbose && console.log(chalk.green(success));
                  };
                  this[`${platform}Prepare`]()
                  .then((success) => {
                    if (success) {
                      this.cliOptions.verbose && console.log(chalk.green(success));
                    };
                    return resolve(messages.done.command.prepare);
                  }, (error) => {
                    if (error) {
                      console.log(chalk.red(error));
                    };
                    return reject(messages.error.command.prepare);
                  });
                }, (error) => {
                  if (error) {
                    console.log(chalk.red(error));
                  };
                  return reject(messages.error.command.prepare);
                });
              }, (error) => {
                console.log(chalk.red(error));
                return reject(messages.error.command.prepare);
              });
            } else {
              console.log(chalk.red(messages.error.platform.invalid.replace(/%s/g, platform)));
              return reject(messages.error.command.prepare);
            }
          } else {
            console.log(chalk.red(messages.error.sahara.notAProjectDirectory));
            return reject(messages.error.command.prepare);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          return reject(messages.error.command.prepare);
        }
      });
    };

    this.preparePlatform = function(platform) {
      this.cliOptions.verbose && console.log(chalk.yellow(messages.info.platform.prepare.replace(/%s/g, `${platform}`)));

      return new Promise((resolve, reject) => {
        if (platform && this[`${platform}Prepare`]) {
          this.getAbsolutePathTo(`platforms/${platform}`)
          .then((platformAbsolutePath) => {
            this.deleteDirectory(platformAbsolutePath)
            .then((success) => {
              this.createDirectory(platformAbsolutePath)
              .then((success) => {
                this.cliOptions.verbose && console.log(chalk.green(success));
                this.getAbsolutePathTo(`platforms/${platform}/platform_app`)
                .then((appAbsolutePath) => {
                  this.getAbsolutePathTo(`platforms/${platform}/platform_app`)
                  .then((platformAppAbsolutePath) => {
                    let spinner = ora({
                      text: chalk.yellow(messages.info.files.copy),
                      spinner: 'pong',
                      color: 'yellow'
                    });

                    spinner.start();

                    ncp(appAbsolutePath, platformAppAbsolutePath, function(error) {
                      if (error) {
                        spinner.fail(chalk.red(messages.info.files.copy));
                        if (error) {
                          console.log(chalk.red(error));
                        };
                        return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                      } else {
                        spinner.succeed(chalk.green(messages.info.files.copy));
                        return resolve(messages.done.platform.prepare.replace(/%s/g, `${platform}`));
                      };
                    });
                  }, (error) => {
                    console.log(chalk.red(error));
                    return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                  });
                }, (error) => {
                  console.log(chalk.red(error));
                  return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                });
              }, (error) => {
                if (error) {
                  console.log(chalk.red(error));
                };
                return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
              });
            }, (error) => {
              if (error) {
                console.log(chalk.red(error));
              };
              return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
            });
          }, (error) => {
            console.log(chalk.red(error));
            return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
          });
        } else {
          return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
        };
      });
    }

    this.win32Prepare = function(platform) {
      return new Promise((resolve, reject) => {
        this.preparePlatform('win32')
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    this.darwinPrepare = function() {
      return new Promise((resolve, reject) => {
        this.preparePlatform('darwin')
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    this.linuxPrepare = function() {
      return new Promise((resolve, reject) => {
        this.preparePlatform('linux')
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };
  };

  Prepare.prototype = command;

  return new Prepare();
})();
