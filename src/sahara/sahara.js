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

// Third party modules.
const ora = require('ora');
const del = require('del');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Electron Sahara modules.
const logger = require('./sahara/logger');
const message = require('./sahara/message');

/**
 * Expose `Command` object.
 * @public
 */
const command = module.exports = (function() {
  let sahara = function() {
    let Sahara = function() {
      this.dir;
      this.cwd;

      this.appPath;
      this.srcPath;
      this.resourcesPath;
      this.platformsPath;
      this.configurationFilePath;

      this.apiCall;

      this.options;
      this.cliOptions = {};

      this.logger = logger(this.cliOptions);
    };

    Sahara.prototype.init = function() {
      this.dir = __dirname + path.sep;
      this.cwd = process.cwd() + path.sep;

      this.appPath = this.cwd + path.sep + 'app' + path.sep;
      this.srcPath = this.cwd + path.sep + 'src' + path.sep;
      this.resourcesPath = this.cwd + path.sep + 'resources' + path.sep;
      this.platformsPath = this.cwd + path.sep + 'platforms' + path.sep;
      this.configurationFilePath = path.normalize(this.cwd + path.sep + 'sahara.json');

      this.options = this.getSaharaOptions();

      return this;
    };

    Sahara.prototype.setCliOptions = function(cliOptions) {
      for (let property in cliOptions) {
        if (cliOptions.hasOwnProperty(property)) {
          this.cliOptions[property] = cliOptions[property];
        }
      }

      return this;
    };

    Sahara.prototype.getSaharaOptions = function() {
      let options = this.options;

      if (options) {
        // Options were already loaded.
        this.logger.info(message.get({
          topic: 'info',
          command: 'sahara',
          message: 'projectDirectory'
        }));
      } else {
        // Loads Sahara options file if available.
        let optionsFilePath = this.configurationFilePath;
        try {
          fs.accessSync(optionsFilePath);
          try {
            options = require(optionsFilePath);
            this.logger.info(message.get({
              topic: 'info',
              command: 'sahara',
              message: 'projectDirectory'
            }));
          } catch(exception) {
            this.logger.error(message.get({
              topic: 'error',
              command: 'sahara',
              message: 'configurationFile'
            }), exception.message);
          }
        } catch(exception) {
          this.logger.info(message.get({
            topic: 'info',
            command: 'sahara',
            message: 'notAProjectDirectory'
          }));
        }
      }

      // returns current sahara options
      return options;
    };

    Sahara.prototype.exec = function(args, apiCall) {
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        return reject(message.get({
          topic: 'error',
          message: 'notImplemented'
        }));
      });
    };

    Sahara.prototype.getAbsolutePathTo = function(file, checkAccess) {
      let normalizedPath = path.normalize(this.cwd + file);
      let absolutePath;
      if (normalizedPath) {
        absolutePath = path.resolve(normalizedPath);
      }
      return new Promise((resolve, reject) => {
        if (absolutePath && absolutePath !== this.cwd) {
          if (checkAccess) {
            fs.access(absolutePath, (error) => {
              if (error) {
                this.logger.error(error);
                return reject(message.get({
                  topic: 'error',
                  command: 'directory',
                  message: 'resolve',
                  replacement: normalizedPath
                }));
              } else {
                return resolve(absolutePath);
              }
            });
          } else {
            return resolve(absolutePath);
          }
        } else {
          return reject(message.get({
            topic: 'error',
            command: 'directory',
            message: 'resolve',
            replacement: normalizedPath
          }));
        }
      });
    };

    Sahara.prototype.createDirectory = function(absolutePath) {
      this.logger.debug(message.get({
        topic: 'info',
        command: 'directory',
        message: 'create'
      }), absolutePath);

      return new Promise((resolve, reject) => {
        if (absolutePath) {
          fs.access(absolutePath, (error) => {
            if (error) {
              fs.mkdir(absolutePath, (error) => {
                if (error) {
                  return reject(error.message);
                } else {
                  return resolve(message.get({
                    topic: 'done',
                    command: 'directory',
                    message: 'created',
                    replacement: absolutePath
                  }));
                }
              });
            } else {
              return resolve(message.get({
                topic: 'done',
                command: 'directory',
                message: 'created',
                replacement: absolutePath
              }));
            }
          });
        } else {
          return reject(message.get({
            topic: 'error',
            command: 'directory',
            message: 'create',
            replacement: absolutePath
          }));
        }
      });
    };

    Sahara.prototype.deleteDirectory = function(absolutePath, force) {
      return new Promise((resolve, reject) => {
        del([absolutePath], {
          dryRun: true
        })
        .then((paths) => {
          if (paths.length) {
            if (force || this.apiCall) {
              del([absolutePath])
              .then((paths) => {
                return resolve(message.get({
                  topic: 'done',
                  command: 'directory',
                  message: 'deleted',
                  replacement: absolutePath
                }));
              }).catch((error) => {
                this.logger.error(error);
                return reject(message.get({
                  topic: 'error',
                  command: 'directory',
                  message: 'deletion',
                  replacement: absolutePath
                }));
              });
            } else {
              inquirer.prompt([{
                default: false,
                type: 'confirm',
                name: 'overwrite',
                message: chalk.yellow(message.get({
                  topic: 'prompt',
                  command: 'directory',
                  message: 'deletion',
                  replacement: paths.join(', ')
                }))
              }]).then((answers) => {
                if (answers.overwrite) {
                  let spinner = ora({
                    text: chalk.yellow(message.get({
                      topic: 'info',
                      command: 'directory',
                      message: 'deletion',
                      replacement: absolutePath
                    })),
                    spinner: 'pong',
                    color: 'yellow'
                  });
                  spinner.start();
                  del([absolutePath])
                  .then((paths) => {
                    spinner.succeed(chalk.green(message.get({
                      topic: 'info',
                      command: 'directory',
                      message: 'deletion',
                      replacement: absolutePath
                    })));
                    return resolve(message.get({
                      topic: 'done',
                      command: 'directory',
                      message: 'deleted',
                      replacement: absolutePath
                    }));
                  }).catch((error) => {
                    spinner.fail(chalk.red(message.get({
                      topic: 'info',
                      command: 'directory',
                      message: 'deletion',
                      replacement: absolutePath
                    })));
                    this.logger.error(error);
                    return reject(message.get({
                      topic: 'error',
                      command: 'directory',
                      message: 'deletion',
                      replacement: asolutePath
                    }));
                  });
                } else {
                  return reject(message.get({
                      topic: 'error',
                      message: 'aborted'
                  }));
                }
              });
            }
          } else {
            return resolve();
          }
        }).catch((error) => {
          this.logger.error(error);
          return reject(message.get({
            topic: 'error',
            command: 'directory',
            message: 'deletion',
            replacement: absolutePath
          }));
        });
      });
    };

    return new Sahara();
  };

  let Command = function() {};

  Command.prototype = (function() {
    return sahara().init();
  }());

  return new Command();
}());
