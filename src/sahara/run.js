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

// Core modules.
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// Electron Sahara modules.
const command = require('./sahara');
const build = require('./build');
const messages = require('./sahara/messages');


/**
 * Expose `Run` object.
 * @public
 */
const run = module.exports = (function() {
  let Run = function() {

    this.packageInfo;
    this.buildDirectory = 'build' + path.sep;
    this.packageInfoFilePath = 'platform_app' + path.sep + 'package.json';

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (this.options) {
            let platform = args.shift() || process.platform;

            if (this[`${platform}Run`]) {
              build.exec([platform])
              .then((success) => {
                if (success) {
                  this.logger.info(success);
                }
                this[`${platform}Run`]()
                .then((success) => {
                  if (success) {
                    this.logger.info(success);
                  }
                  return resolve(messages.done.command.run);
                }, (error) => {
                  if (error) {
                    this.logger.error(error);
                  }
                  return reject(messages.error.command.run);
                });
              }, (error) => {
                if (error) {
                  this.logger.error(error);
                }
                return reject(messages.error.command.run);
              });
            } else {
              this.logger.error(messages.error.platform.invalid, platform);
              return reject(messages.error.command.run);
            }
          } else {
            this.logger.error(messages.error.sahara.notAProjectDirectory);
            return reject(messages.error.command.run);
          }
        } else {
          this.logger.error(messages.error.argument.missing);
          return reject(messages.error.command.run);
        }
      });
    };

    this.getPackageInformation = function(platform) {
      let packageInfo = this.packageInfo;

      if (packageInfo) {
        // Package information file was already loaded.
        this.logger.info(messages.info.run.packageFound);
      } else {
        // Loads package information file if available.
        let packageInfoFilePath = path.normalize(this.platformsPath + path.sep + platform + path.sep + this.packageInfoFilePath);
        try {
          fs.accessSync(packageInfoFilePath);
          try {
            packageInfo = require(packageInfoFilePath);
            this.logger.info(messages.info.run.packageFound);
          } catch(exception) {
            this.logger.error(messages.error.run.packageFile, exception.message);
          }
        } catch(exception) {
          this.logger.error(messages.error.run.packageFileNotFound.replace(/%s/g, `${packageInfoFilePath}`));
        }
      }

      // returns current package information file
      return packageInfo;
    };
    
    this.runPlatform = function(platform) {
      this.logger.debug(messages.info.platform.run, platform);

      return new Promise((resolve, reject) => {
        this.packageInfo = this.getPackageInformation(platform);
        if (this.packageInfo && this.packageInfo.name) {
          let binaryName = this.packageInfo.name;
          this.buildPath = this.platformsPath + platform + path.sep + this.buildDirectory;
          fs.readdir(this.buildPath, (error, files) => {
            if (error) {
              this.logger.error(messages.error.directory.fetch.replace(/%s/g, this.buildPath));
              return reject(messages.error.platform.run.replace(/%s/g, platform));
            } else {
              let buildDirectory;
              let found = files.some((file, index, files) => {
                if (file.indexOf(`${binaryName}-${platform}`) === 0) {
                  try {
                    let stat = fs.statSync(this.buildPath + file);
                    if (stat.isDirectory()) {
                      buildDirectory = this.buildPath + file;
                      return true;
                    }
                  } catch(exception) {
                    this.logger.notice(messages.error.directory.fetch.replace(/%s/g, this.buildPath + file));
                  }
                }
              });
              if (found && buildDirectory) {
                let binary = buildDirectory + path.sep + binaryName;
                childProcess.execFile(binary, (error, stdout, stderr) => {
                  if (error) {
                    this.logger.error(error);
                    return reject(messages.error.platform.run.replace(/%s/g, platform));
                  } else {
                    if (stderr) {
                      this.logger.error(stderr);
                      return reject(messages.error.platform.run.replace(/%s/g, platform));
                    } else {
                      return resolve(messages.done.platform.run.replace(/%s/g, platform));
                    }
                  }
                });
              } else {
                this.logger.error(messages.error.run.noBuildDirectory);
                return reject(messages.error.platform.run.replace(/%s/g, platform));
              }
              
            }
          });
        } else {
          return reject(messages.error.platform.run.replace(/%s/g, platform));
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

  return new Run();
}());
