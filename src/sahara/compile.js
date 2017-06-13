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
const messages = require('./sahara/messages');

/**
 * Expose `Clean` object.
 * @public
 */
const compile = module.exports = (function() {
  let Compile = function() {
    this.electronPackager;

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (this.settings) {
            let platform = args.shift() || process.platform;

            if (this[`${platform}Compile`]) {
              this.requireElectronPackager()
              .then((success) => {
                if (success) {
                  this.logger.info(success);
                }
                this[`${platform}Compile`]()
                .then((success) => {
                  if (success) {
                    this.logger.info(success);
                  }
                  return resolve(messages.done.command.compile);
                }, (error) => {
                  if (error) {
                    this.logger.error(error);
                  }
                  return reject(messages.error.command.compile);
                });
              }, (error) => {
                if (error) {
                  this.logger.error(error);
                }
                return reject(messages.error.command.compile);
              });
            } else {
              this.logger.error(messages.error.action.invalid);
              return reject(messages.error.command.compile);
            }
          } else {
            this.logger.error(messages.error.sahara.notAProjectDirectory);
            return reject(messages.error.command.compile);
          }
        } else {
          this.logger.error(messages.error.argument.missing);
          return reject(messages.error.command.compile);
        }
      });
    };

    this.requireElectronPackager = function() {
      this.logger.debug(messages.info.packager.loading);

      return new Promise((resolve, reject) => {
        try {
          this.getAbsolutePathTo('node_modules/electron-packager')
          .then((electronPackagerPath) => {
            try {
              this.electronPackager = require(electronPackagerPath);
              return resolve(messages.done.packager.loaded);
            } catch (error) {
              return reject(messages.error.packager.require);
            }
          }, (error) => {
            return reject(messages.error.packager.resolve);
          });
        } catch (error) {
          return reject(messages.error.packager.resolve);
        }
      });
    };

    this.compilePlatform = function(platform, options) {
      options = options || {};
      return new Promise((resolve, reject) => {
        this.getAbsolutePathTo(`platforms/${platform}/platform_app`)
        .then((sourceDirectory) => {
          this.getAbsolutePathTo(`platforms/${platform}/build`)
          .then((outputDirectory) => {
            // Target platform
            options.platform = `${platform}`;
            // Source directory.
            options.dir = sourceDirectory;
            // Target directory
            options.out = outputDirectory;

            let spinner = ora({
              text: chalk.yellow(messages.info.packager.building.replace(/%s/g, `${platform}`)),
              spinner: 'pong',
              color: 'yellow'
            });

            spinner.start();

            this.electronPackager(options, (error, success) => {
              if (error) {
                spinner.fail(chalk.red(messages.info.packager.building.replace(/%s/g, `${platform}`)));
                if (error.message) {
                  this.logger.error(error.message);
                } else {
                  this.logger.error(error);
                }
                return reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
              } else {
                spinner.succeed(chalk.green(messages.info.packager.building.replace(/%s/g, `${platform}`)));
                return resolve(messages.done.packager.built.replace(/%s/g, `${platform}`));
              }
            });
          }, (error) => {
            this.logger.error(error);
            return reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
          });
        }, (error) => {
          this.logger.error(error);
          return reject(messages.error.packager.build.replace(/%s/g, `${platform}`));
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
