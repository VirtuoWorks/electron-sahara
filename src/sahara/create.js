'use strict';

const childProcess = require('child_process');

const ora = require('ora');
const chalk = require('chalk');
const simpleGit = require('simple-git');

const command = require('./sahara');
const messages = require('./sahara/messages');
const templates = require('./create/templates');

exports = module.exports = (function() {
  let Create = function() {
    this.apiCall;

    this.exec = function(args, apiCall) {
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (!this.settings) {
            let projectDirectoryName = args.shift();
            let projectTemplate = args.shift() || 'vanilla';

            if (projectDirectoryName) {
              this.getAbsolutePathTo(projectDirectoryName)
              .then((projectAbsolutePath) => {
                this.deleteDirectory(projectAbsolutePath)
                .then((success) => {
                  this.createDirectory(projectAbsolutePath)
                  .then((success) => {
                    this.cliOptions.verbose && console.log(chalk.green(success));
                    this.cloneProjectTemplate(projectTemplate, projectAbsolutePath)
                    .then((success) => {
                      this.cliOptions.verbose && console.log(chalk.green(success));
                      this.installProjectDependencies(projectAbsolutePath)
                      .then((success) => {
                        if (success) {
                          this.cliOptions.verbose && console.log(chalk.green(success));
                        }
                        return resolve(messages.done.command.create);
                      }, (error) => {
                        if (error) {
                          console.log(chalk.red(error));
                        }
                        this.deleteDirectory(projectAbsolutePath, true)
                        .then((success) => {
                          return reject(messages.error.command.create);
                        }, (error) => {
                          return reject(messages.error.command.create);
                        });
                      });
                    }, (error) => {
                      if (error) {
                        console.log(chalk.red(error));
                      }
                      this.deleteDirectory(projectAbsolutePath, true)
                      .then((success) => {
                        return reject(messages.error.command.create);
                      }, (error) => {
                        return reject(messages.error.command.create);
                      });
                    });
                  }, (error) => {
                    if (error) {
                      console.log(chalk.red(error));
                    }
                    return reject(messages.error.command.create);
                  });
                }, (error) => {
                  if (error) {
                    console.log(chalk.red(error));
                  }
                  return reject(messages.error.command.create);
                });
              }, (error) => {
                console.log(chalk.red(error));
                return reject(messages.error.command.create);
              });
            } else {
              console.log(chalk.red(messages.error.argument.missing));
              return reject(messages.error.command.create);
            }
          } else {
            console.log(chalk.red(messages.error.sahara.projectDirectory));
            return reject(messages.error.command.create);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          return reject(messages.error.command.create);
        }
      });
    };

    this.installProjectDependencies = function(projectAbsolutePath) {
      return new Promise((resolve, reject) => {
        let command = `cd ${projectAbsolutePath} && npm install`;

        let spinner = ora({
          text: chalk.yellow(messages.info.dependencies.install),
          spinner: 'pong',
          color: 'yellow'
        });

        spinner.start();

        childProcess.exec(command, (error, stdout, stderr) => {
          if (error) {
            spinner.fail(chalk.red(messages.info.dependencies.install));
            return reject(error);
          } else {
            if (stderr) {
              // To prevent failure while using npm >= 5.0.0.
              if (stderr.indexOf("npm notice created a lockfile as package-lock.json. You should commit this file.") !== -1) {
                spinner.succeed(chalk.green(messages.info.dependencies.install));
                return resolve(messages.done.dependencies.install);
              } else {
                spinner.fail(chalk.red(messages.info.dependencies.install));
                return reject(stderr);
              }
            } else {
              spinner.succeed(chalk.green(messages.info.dependencies.install));
              return resolve(messages.done.dependencies.install);
            }
          }
        });
      });
    };

    this.cloneProjectTemplate = function(projectTemplate, projectAbsolutePath) {
      this.cliOptions.verbose && console.log(chalk.yellow(messages.info.template.clone));

      return new Promise((resolve, reject) => {
        if (templates[projectTemplate]) {
          simpleGit().clone(templates[projectTemplate], projectAbsolutePath)
          .then((error, success) => {
            if (error) {
              console.log(chalk.red(error));
              return reject(messages.error.template.clone);
            } else {
              return resolve(messages.done.template.cloned);
            }
          });
        } else {
          return reject(messages.error.template.notFound);
        }
      });
    };
  };

  Create.prototype = command;

  return new Create();
})();
