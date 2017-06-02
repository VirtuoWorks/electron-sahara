'use strict';

const childProcess = require('child_process');

const ora = require('ora');
const chalk = require('chalk');
const simpleGit = require('simple-git');

const command = require('./sahara');
const messages = require('./sahara/messages');
const templates = require('./create/templates');

exports = module.exports = (function(){

  var Create = function(){

    this.apiCall;

    this.exec = function(args, apiCall){
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (!this.settings) {
            var projectDirectoryName = args.shift();
            var projectTemplate = args.shift() || 'vanilla';

            if (projectDirectoryName) {
              var projectAbsolutePath = this.getAbsolutePathTo(projectDirectoryName).then((projectAbsolutePath) => {
                this.deleteDirectory(projectAbsolutePath).then((success) => {
                  this.createDirectory(projectAbsolutePath).then((success) => {
                    this.cliOptions.verbose && console.log(chalk.green(success));
                    this.cloneProjectTemplate(projectTemplate, projectAbsolutePath).then((success) => {
                      this.cliOptions.verbose && console.log(chalk.green(success));
                      this.installProjectDependencies(projectAbsolutePath).then((success) => {
                        if (success) {
                          this.cliOptions.verbose && console.log(chalk.green(success));
                        };
                        return resolve(messages.done.command.create);
                      }, (error) => {
                        if (error) {
                          console.log(chalk.red(error));
                        }
                        this.deleteDirectory(projectAbsolutePath, true).then((success) => {
                          return reject(messages.error.command.create);
                        }, (error) => {
                          return reject(messages.error.command.create);
                        });
                      });
                    }, (error) => {
                      if (error) {
                        console.log(chalk.red(error));
                      };
                      this.deleteDirectory(projectAbsolutePath, true).then((success) => {
                        return reject(messages.error.command.create);
                      }, (error) => {
                        return reject(messages.error.command.create);
                      });
                    });
                  }, (error) => {
                    if (error) {
                      console.log(chalk.red(error));
                    };
                    return reject(messages.error.command.create);
                  });
                }, (error) => {
                  if (error) {
                    console.log(chalk.red(error));
                  };
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
        var command = `cd ${projectAbsolutePath} && npm install`;

        var spinner = ora({
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
              spinner.fail(chalk.red(messages.info.dependencies.install));
              return reject(stderr);
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
          simpleGit().clone(templates[projectTemplate], projectAbsolutePath).then((error, success) => {
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