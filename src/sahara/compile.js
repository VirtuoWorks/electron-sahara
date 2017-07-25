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

// Electron Sahara modules.
const command = require('./sahara');
const message = require('./sahara/message');

/**
 * Expose `Clean` object.
 * @public
 */
const compile = module.exports = (function() {
  let Compile = function() {
    this.electronPackager;

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args)) {
          if (this.options) {
            let [platform] = args || [process.platform];

            if (!args.length) {
              this.logger.debug(message.get({
                topic: 'info',
                command: 'platform',
                message: 'current'
              }), platform);
            }

            if (this[`${platform}Compile`]) {
              return this.requireElectronPackager()
              .then((success) => {
                this.logger.info(success);
                return this[`${platform}Compile`]();
              })
              .then((success) => {
                this.logger.info(success);
                return resolve(message.get({
                  topic: 'done',
                  command: 'compile',
                  message: 'success'
                }));
              })
              .catch((error) => {
                this.logger.error(error);
                return reject(message.get({
                  topic: 'error',
                  command: 'compile',
                  message: 'failure'
                }));
              });
            } else {
              this.logger.error(message.get({
                topic: 'error',
                command: 'action',
                message: 'invalid'
              }));
            }
          } else {
            this.logger.error(message.get({
              topic: 'error',
              command: 'sahara',
              message: 'notAProjectDirectory'
            }));
          }
        } else {
          this.logger.error(message.get({
            topic: 'error',
            command: 'argument',
            message: 'missing'
          }));
        }
        return reject(message.get({
          topic: 'error',
          command: 'compile',
          message: 'failure'
        }));
      });
    };

    this.requireElectronPackager = function() {
      this.logger.debug(message.get({
        topic: 'info',
        command: 'packager',
        message: 'loading'
      }));

      return new Promise((resolve, reject) => {
        try {
          this.getAbsolutePathTo('node_modules/electron-packager', true)
          .then((electronPackagerPath) => {
            try {
              this.electronPackager = require(electronPackagerPath);
              return resolve(message.get({
                topic: 'done',
                command: 'packager',
                message: 'loaded'
              }));
            } catch (error) {
              return reject(message.get({
                topic: 'error',
                command: 'packager',
                message: 'require'
              }));
            }
          }, (error) => {
            return reject(message.get({
              topic: 'error',
              command: 'packager',
              message: 'resolve'
            }));
          });
        } catch (error) {
          return reject(message.get({
            topic: 'error',
            command: 'packager',
            message: 'resolve'
          }));
        }
      });
    };

    this.compilePlatform = function(platform, options) {
      options = options || {};
      return new Promise((resolve, reject) => {
        return Promise.all([
          this.getAbsolutePathTo(`platforms/${platform}/platform_app`, true),
          this.getAbsolutePathTo(`platforms/${platform}/build`)
        ])
        .then(([sourceDirectory, outputDirectory]) => {
          // Target platform
          options.platform = `${platform}`;
          // Source directory.
          options.dir = sourceDirectory;
          // Target directory
          options.out = outputDirectory;

          let spinner = ora({
            text: chalk.yellow(message.get({
              topic: 'info',
              command: 'packager',
              message: 'building',
              replacement: platform
            })),
            spinner: 'pong',
            color: 'yellow'
          });

          spinner.start();

          this.electronPackager(options, (error, success) => {
            if (error) {
              spinner.fail(chalk.red(message.get({
                topic: 'info',
                command: 'packager',
                message: 'building',
                replacement: platform
              })));
              if (error.message) {
                this.logger.error(error.message);
              } else {
                this.logger.error(error);
              }
              return reject(message.get({
                topic: 'error',
                command: 'packager',
                message: 'build',
                replacement: platform
              }));
            } else {
              spinner.succeed(chalk.green(message.get({
                topic: 'info',
                command: 'packager',
                message: 'building',
                replacement: platform
              })));
              return resolve(message.get({
                topic: 'done',
                command: 'packager',
                message: 'built',
                replacement: platform
              }));
            }
          });
        })
        .catch((error) => {
          this.logger.error(error);
          return reject(message.get({
            topic: 'error',
            command: 'packager',
            message: 'build',
            replacement: platform
          }));
        });
      });
    };

    this.win32Compile = function() {
      return new Promise((resolve, reject) => {
        let options = {
          quiet: true,
          asar: true,
          arch: 'x64',
          prune: true,
          overwrite: true
        };

        this.compilePlatform('win32', options)
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    this.darwinCompile = function() {
      return new Promise((resolve, reject) => {
        let options = {
          quiet: true,
          asar: true,
          arch: 'x64',
          prune: true,
          overwrite: true
        };

        this.compilePlatform('darwin', options)
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    this.linuxCompile = function() {
      return new Promise((resolve, reject) => {
        let options = {
          quiet: true,
          asar: true,
          arch: 'x64',
          prune: true,
          overwrite: true
        };

        this.compilePlatform('linux', options)
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };
  };

  Compile.prototype = command;

  return new Compile();
}());
