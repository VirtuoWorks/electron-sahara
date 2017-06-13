/*!
 * Electron Sahara
 * @author sami.radi@virtuoworks.com (Sami Radi)
 * @company VirtuoWorks
 * @license MIT
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

// Third party modules.
const ora = require('ora');
const chalk = require('chalk');
const ncp = require('ncp').ncp;

// Electron Sahara modules.
const command = require('./sahara');
const messages = require('./sahara/messages');

/**
 * Expose `Prepare` object.
 * @public
 */
const prepare = module.exports = (function() {
  let Prepare = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (this.settings) {
            let platform = args.shift() || process.platform;

            if (this[`${platform}Prepare`]) {
              this.getAbsolutePathTo('platforms')
              .then((platformsAbsolutePath) => {
                this.createDirectory(platformsAbsolutePath)
                .then((success) => {
                  if (success) {
                    this.logger.info(success);
                  }
                  this[`${platform}Prepare`]()
                  .then((success) => {
                    if (success) {
                      this.logger.info(success);
                    }
                    return resolve(messages.done.command.prepare);
                  }, (error) => {
                    if (error) {
                      this.logger.error(error);
                    }
                    return reject(messages.error.command.prepare);
                  });
                }, (error) => {
                  if (error) {
                    this.logger.error(error);
                  }
                  return reject(messages.error.command.prepare);
                });
              }, (error) => {
                this.logger.error(error);
                return reject(messages.error.command.prepare);
              });
            } else {
              this.logger.error(messages.error.platform.invalid, platform);
              return reject(messages.error.command.prepare);
            }
          } else {
            this.logger.error(messages.error.sahara.notAProjectDirectory);
            return reject(messages.error.command.prepare);
          }
        } else {
          this.logger.error(messages.error.argument.missing);
          return reject(messages.error.command.prepare);
        }
      });
    };

    this.preparePlatform = function(platform) {
      this.logger.debug(messages.info.platform.prepare, platform);

      return new Promise((resolve, reject) => {
        if (platform && this[`${platform}Prepare`]) {
          this.getAbsolutePathTo(`platforms/${platform}`)
          .then((platformAbsolutePath) => {
            this.deleteDirectory(platformAbsolutePath)
            .then((success) => {
              this.createDirectory(platformAbsolutePath)
              .then((success) => {
                this.logger.info(success);
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
                          this.logger.error(error);
                        }
                        return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                      } else {
                        spinner.succeed(chalk.green(messages.info.files.copy));
                        return resolve(messages.done.platform.prepare.replace(/%s/g, `${platform}`));
                      }
                    });
                  }, (error) => {
                    this.logger.error(error);
                    return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                  });
                }, (error) => {
                  this.logger.error(error);
                  return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
                });
              }, (error) => {
                if (error) {
                  this.logger.error(error);
                }
                return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
              });
            }, (error) => {
              if (error) {
                this.logger.error(error);
              }
              return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
            });
          }, (error) => {
            this.logger.error(error);
            return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
          });
        } else {
          return reject(messages.error.platform.prepare.replace(/%s/g, `${platform}`));
        }
      });
    };

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
}());
