'use strict';

const fs = require('fs');
const path = require('path');

const ora = require('ora');
const del = require('del');
const chalk = require('chalk');
const prompt = require('prompt');

const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let sahara = function() {
    let Sahara = function() {
      this.apiCall;
      this.settings;
      this.cliOptions = {};
      this.saharaDirectory;
      this.workingDirectory;
    };

    Sahara.prototype.init = function() {
      this.setCommandSettings();
      this.saharaDirectory = __dirname;
      this.workingDirectory = process.cwd();
      return this;
    };

    Sahara.prototype.setCliOptions = function(cliOptions) {
      this.cliOptions = cliOptions;
      return this;
    };

    Sahara.prototype.setCommandSettings = function() {
      // Loads Sahara settings file if available
      let settingsFilePath = path.normalize(process.cwd() + path.sep + 'sahara.json');
      try {
        fs.accessSync(settingsFilePath);
        try {
          this.settings = require(settingsFilePath);
          this.cliOptions.verbose && console.log(chalk.yellow(messages.info.sahara.projectDirectory));
        } catch(exception) {
          console.log(chalk.red(messages.error.sahara.configurationFile.replace(/%s/g, exception.message)));
        };
      } catch(exception) {
        this.cliOptions.verbose && console.log(chalk.yellow(messages.info.sahara.notAProjectDirectory));
      };
      return this;
    };

    Sahara.prototype.exec = function(args, apiCall) {
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        return reject(messages.error.command.notImplemented);
      });
    };

    Sahara.prototype.getAbsolutePathTo = function(file) {
      let basePath = this.workingDirectory + path.sep;
      let normalizedPath = path.normalize(basePath + file);
      let absolutePath;
      if (normalizedPath) {
        absolutePath = path.resolve(normalizedPath);
      };
      return new Promise((resolve, reject) => {
        if (absolutePath && absolutePath != this.workingDirectory) {
          return resolve(absolutePath);
        } else {
          return reject(messages.error.directory.resolve.replace(/%s/g, normalizedPath));
        };
      });
    };

    Sahara.prototype.createDirectory = function(absolutePath) {
      this.cliOptions.verbose && console.log(chalk.yellow(messages.info.directory.create.replace(/%s/g, absolutePath)));

      return new Promise((resolve, reject) => {
        if (absolutePath) {
          fs.access(absolutePath, (error) => {
            if (error) {
              fs.mkdir(absolutePath, (error) => {
                if (error) {
                  return reject(error.message);
                } else {
                  return resolve(messages.done.directory.created.replace(/%s/g, absolutePath));
                };
              });
            } else {
              return resolve(messages.done.directory.created.replace(/%s/g, absolutePath));
            };
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
                    if (result.question.toLowerCase()[0] == 'y') {
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
                };
              });
            };
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
  })();

  return new Command();
})();
