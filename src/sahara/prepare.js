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
const message = require('./sahara/message');

/**
 * Expose `Prepare` object.
 * @public
 */
const prepare = module.exports = (function() {
  let Prepare = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args)) {
          if (this.options) {
            let platform;
            if (!args.length) {
              platform = process.platform;
              this.logger.debug(message.get({
                type: 'info',
                command: 'platform',
                message: 'current'
              }), platform);
            } else {
              platform = args.shift();
            }

            if (this[`${platform}Prepare`]) {
              return this.getAbsolutePathTo('platforms')
              .then((platformsAbsolutePath) => {
                return this.createDirectory(platformsAbsolutePath);
              })
              .then((success) => {
                this.logger.info(success);
                return this[`${platform}Prepare`]();
              })
              .then((success) => {
                this.logger.info(success);
                return resolve(message.get({
                  type: 'done',
                  command: 'prepare',
                  message: 'success'
                }));
              })
              .catch((error) => {
                this.logger.error(error);
                return reject(message.get({
                  type: 'error',
                  command: 'prepare',
                  message: 'failure'
                }));
              });

            } else {
              this.logger.error(message.get({
                type: 'error',
                command: 'platform',
                message: 'invalid'
              }), platform);
            }
          } else {
            this.logger.error(message.get({
              type: 'error',
              command: 'sahara',
              message: 'notAProjectDirectory'
            }));
          }
        } else {
          this.logger.error(message.get({
            type: 'error',
            command: 'argument',
            message: 'missing'
          }));
        }
        return reject(message.get({
          type: 'error',
          command: 'prepare',
          message: 'failure'
        }));
      });
    };

    this.preparePlatform = function(platform) {
      this.logger.debug(message.get({
        type: 'info',
        command: 'platform',
        message: 'prepare'
      }), platform);

      return new Promise((resolve, reject) => {
        if (platform && this[`${platform}Prepare`]) {
          return this.getAbsolutePathTo(`platforms/${platform}`)
          .then((platformAbsolutePath) => {
            return Promise.all([
              platformAbsolutePath,
              this.deleteDirectory(platformAbsolutePath)
            ]);
          })
          .then((paths) => {
            let platformAbsolutePath = paths.shift();
            return this.createDirectory(platformAbsolutePath);
          })
          .then((success) => {
            this.logger.info(success);
            return Promise.all([
              this.getAbsolutePathTo('app', true),
              this.getAbsolutePathTo(`platforms/${platform}/platform_app`)
            ]);
          })
          .then((paths) => {
            let appAbsolutePath = paths.shift();
            let platformAppAbsolutePath = paths.shift();
            let spinner = ora({
              text: chalk.yellow(message.get({
                type: 'info',
                command: 'files',
                message: 'copy'
              })),
              spinner: 'pong',
              color: 'yellow'
            });

            spinner.start();

            ncp(appAbsolutePath, platformAppAbsolutePath, (error) => {
              if (error) {
                spinner.fail(chalk.red(message.get({
                  type: 'info',
                  command: 'files',
                  message: 'copy'
                })));
                this.logger.error(error);
                return reject(message.get({
                  type: 'error',
                  command: 'platform',
                  message: 'prepare',
                  replacement: platform
                }));
              } else {
                spinner.succeed(chalk.green(message.get({
                  type: 'info',
                  command: 'files',
                  message: 'copy'
                })));
                return resolve(message.get({
                  type: 'done',
                  command: 'platform',
                  message: 'prepare',
                  replacement: platform
                }));
              }
            });
          })
          .catch((error) => {
            this.logger.error(error);
            return reject(message.get({
              type: 'error',
              command: 'platform',
              message: 'prepare',
              replacement: platform
            }));
          });
        } else {
          return reject(message.get({
            type: 'error',
            command: 'platform',
            message: 'prepare',
            replacement: platform
          }));
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
