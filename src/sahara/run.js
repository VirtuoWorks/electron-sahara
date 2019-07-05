/*
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

// Core modules.
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// Third party modules.
const sanitize = require('sanitize-filename');

// Electron Sahara modules.
const command = require('./sahara');
const build = require('./build');
const message = require('./sahara/message');

/**
 * Expose `Run` object.
 * @public
 */
module.exports = (function() {
  const Run = function() {
    this.packageInfo;
    this.buildDirectory = 'build' + path.sep;
    this.packageInfoFilePath = 'platform_app' + path.sep + 'package.json';

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args)) {
          if (this.options) {
            const platform = args.shift() || process.platform;

            if (!args.length) {
              this.logger.debug(message.get({
                type: 'info',
                command: 'platform',
                message: 'current'
              }), platform);
            }

            if (this[`${platform}Run`]) {
              return build.exec([platform])
                  .then((success) => {
                    this.logger.info(success);
                    return this[`${platform}Run`]();
                  })
                  .then((success) => {
                    this.logger.info(success);
                    return resolve(message.get({
                      type: 'done',
                      command: 'run',
                      message: 'success'
                    }));
                  })
                  .catch((error) => {
                    this.logger.error(error);
                    return reject(message.get({
                      type: 'error',
                      command: 'run',
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
          command: 'run',
          message: 'failure'
        }));
      });
    };

    this.getPackageInformation = function(platform) {
      let packageInfo = this.packageInfo;

      if (packageInfo) {
        // Package information file was already loaded.
        this.logger.info(message.get({
          type: 'info',
          command: 'run',
          message: 'packageFound'
        }));
      } else {
        // Loads package information file if available.
        const packageInfoFilePath = path.normalize(
            this.cwd + path.sep + this.platformsPath + path.sep + platform + path.sep + this.packageInfoFilePath
        );
        try {
          fs.accessSync(packageInfoFilePath);
          try {
            packageInfo = require(packageInfoFilePath);
            this.logger.debug(message.get({
              type: 'info',
              command: 'run',
              message: 'packageFound'
            }));
          } catch (exception) {
            this.logger.error(message.get({
              type: 'error',
              command: 'run',
              message: 'packageFile'
            }), exception.message);
          }
        } catch (exception) {
          this.logger.error(message.get({
            type: 'error',
            command: 'run',
            message: 'packageFileNotFound'
          }), packageInfoFilePath);
        }
      }

      // returns current package information file
      return packageInfo;
    };

    this.runPlatform = function(platform) {
      this.logger.debug(message.get({
        type: 'info',
        command: 'platform',
        message: 'run'
      }), platform);

      return new Promise((resolve, reject) => {
        this.packageInfo = this.getPackageInformation(platform);
        if (this.packageInfo && this.packageInfo.name) {
          const binaryName = sanitize(this.packageInfo.name, {
            replacement: '-'
          });
          this.buildPath = path.normalize(
              this.cwd + path.sep + this.platformsPath + platform + path.sep + this.buildDirectory
          );
          fs.readdir(this.buildPath, (error, files) => {
            if (error) {
              this.logger.error(message.get({
                type: 'error',
                command: 'directory',
                message: 'fetch'
              }), this.buildPath);
              return reject(message.get({
                type: 'error',
                command: 'platform',
                message: 'run',
                replacement: platform
              }));
            } else {
              let buildDirectory;
              const found = files.some((file, index, files) => {
                if (file.indexOf(`${binaryName}-${platform}`) === 0) {
                  const toCheck = path.normalize(this.buildPath + file);
                  try {
                    const stat = fs.statSync(toCheck);
                    if (stat.isDirectory()) {
                      buildDirectory = toCheck;
                      return true;
                    }
                  } catch (exception) {
                    this.logger.notice(message.get({
                      type: 'error',
                      command: 'directory',
                      message: 'fetch'
                    }), toCheck);
                  }
                }
              });
              if (found && buildDirectory) {
                let binary = path.normalize(
                    this.cwd + path.sep + buildDirectory + path.sep + binaryName
                );
                switch (platform) {
                  case 'linux':
                    binary = `${binary}`;
                    break;
                  case 'win32':
                    binary = `START ${binary}.exe`;
                    break;
                  case 'darwin':
                    binary = `open ${binary}.app`;
                    break;
                }
                childProcess.exec(binary, (error, stdout, stderr) => {
                  if (error) {
                    this.logger.error(error);
                    return reject(message.get({
                      type: 'error',
                      command: 'platform',
                      message: 'run',
                      replacement: platform
                    }));
                  } else {
                    if (stderr) {
                      this.logger.error(stderr);
                      return reject(message.get({
                        type: 'error',
                        command: 'platform',
                        message: 'run',
                        replacement: platform
                      }));
                    } else {
                      return resolve(message.get({
                        type: 'done',
                        command: 'platform',
                        message: 'run',
                        replacement: platform
                      }));
                    }
                  }
                });
              } else {
                this.logger.error(message.get({
                  type: 'error',
                  command: 'run',
                  message: 'noBuildDirectory'
                }));
                return reject(message.get({
                  type: 'error',
                  command: 'platform',
                  message: 'run',
                  replacement: platform
                }));
              }
            }
          });
        } else {
          return reject(message.get({
            type: 'error',
            command: 'platform',
            message: 'run',
            replacement: platform
          }));
        }
      });
    };

    this.win32Run = function(platform) {
      return new Promise((resolve, reject) => {
        this.runPlatform('win32')
            .then((success) => {
              return resolve(success);
            }, (error) => {
              return reject(error);
            });
      });
    };

    this.darwinRun = function(platform) {
      return new Promise((resolve, reject) => {
        this.runPlatform('darwin')
            .then((success) => {
              return resolve(success);
            }, (error) => {
              return reject(error);
            });
      });
    };

    this.linuxRun = function(platform) {
      return new Promise((resolve, reject) => {
        this.runPlatform('linux')
            .then((success) => {
              return resolve(success);
            }, (error) => {
              return reject(error);
            });
      });
    };
  };

  Run.prototype = command;
  Run.prototype.constructor = Run;

  return new Run();
}());
