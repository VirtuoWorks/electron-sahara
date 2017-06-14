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
const prompt = require('prompt');

// Electron Sahara modules.
const logger = require('./sahara/logger');
const messages = require('./sahara/messages');

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
        this.logger.info(messages.info.sahara.projectDirectory);
      } else {
        // Loads Sahara options file if available.
        let optionsFilePath = this.configurationFilePath;
        try {
          fs.accessSync(optionsFilePath);
          try {
            options = require(optionsFilePath);
            this.logger.info(messages.info.sahara.projectDirectory);
          } catch(exception) {
            this.logger.error(messages.error.sahara.configurationFile, exception.message);
          }
        } catch(exception) {
          this.logger.info(messages.info.sahara.notAProjectDirectory);
        }
      }

      // returns current sahara options
      return options;
    };

    Sahara.prototype.exec = function(args, apiCall) {
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        return reject(messages.error.command.notImplemented);
      });
    };

    Sahara.prototype.getAbsolutePathTo = function(file) {
      let normalizedPath = path.normalize(this.cwd + file);
      let absolutePath;
      if (normalizedPath) {
        absolutePath = path.resolve(normalizedPath);
      }
      return new Promise((resolve, reject) => {
        if (absolutePath && absolutePath !== this.cwd) {
          return resolve(absolutePath);
        } else {
          return reject(messages.error.directory.resolve.replace(/%s/g, normalizedPath));
        }
      });
    };

    Sahara.prototype.createDirectory = function(absolutePath) {
      this.logger.info(messages.info.directory.create, absolutePath);

      return new Promise((resolve, reject) => {
        if (absolutePath) {
          fs.access(absolutePath, (error) => {
            if (error) {
              fs.mkdir(absolutePath, (error) => {
                if (error) {
                  return reject(error.message);
                } else {
                  return resolve(messages.done.directory.created.replace(/%s/g, absolutePath));
                }
              });
            } else {
              return resolve(messages.done.directory.created.replace(/%s/g, absolutePath));
            }
          });
        } else {
          return reject(messages.error.directory.create.replace(/%s/g, absolutePath));
        }
      });
    };

    Sahara.prototype.deleteDirectory = function(absolutePath, force) {
      return new Promise((resolve, reject) => {
       del([absolutePath], {dryRun: true})
       .then((paths) => {
          if (paths.length) {
            if (force || this.apiCall) {
              del([absolutePath])
              .then((paths) => {
                return resolve(messages.info.directory.deletion.replace(/%s/g, absolutePath));
              }).catch(function(error) {
                return reject(messages.error.directory.deletion.replace(/%s/g, absolutePath));
              });
            } else {
              prompt.start();
              prompt.get({
                description: messages.prompt.directory.deletion.replace(/%s/g, paths.join(', ')),
                type: 'string',
                pattern: /^(y|yes|n|no)$/i,
                message: 'Wrong input',
                required: true
              }, (error, result) => {
                if (error) {
                  return reject(messages.error.command.aborted);
                } else {
                  if (result.question) {
                    if (result.question.toLowerCase()[0] === 'y') {
                      let spinner = ora({
                        text: chalk.yellow(messages.info.directory.deletion.replace(/%s/g, absolutePath)),
                        spinner: 'pong',
                        color: 'yellow'
                      });
                      spinner.start();
                      del([absolutePath])
                      .then((paths) => {
                        spinner.succeed(chalk.green(messages.info.directory.deletion.replace(/%s/g, absolutePath)));
                        return resolve(messages.error.directory.deletion.replace(/%s/g, absolutePath));
                      }).catch(function(error) {
                        spinner.fail(chalk.red(messages.info.directory.deletion.replace(/%s/g, absolutePath)));
                        return reject(messages.error.directory.deletion.replace(/%s/g, absolutePath));
                      });
                    } else {
                      return reject(messages.error.command.aborted);
                    }
                  } else {
                    return reject(messages.error.command.aborted);
                  }
                }
              });
            }
          } else {
            return resolve();
          };
        }).catch(function(error) {
          return reject(messages.error.directory.deletion.replace(/%s/g, absolutePath));
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
