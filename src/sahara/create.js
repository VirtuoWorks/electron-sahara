'use strict';

const path = require('path');
const childProcess = require('child_process');

const ora = require('ora');
const chalk = require('chalk');
const simpleGit = require('simple-git');

const command = require('./sahara');
const messages = require('../messages/messages');
const templates = require('../templates/templates');

exports = module.exports = (function(){

  var Create = function(){

    this.apiCall;

    this.exec = function(args, apiCall){
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          var projectDirectoryName = args.shift();
          var projectTemplate = args.shift() || 'vanilla';

          if (projectDirectoryName) {

            var projectAbsolutePath = path.resolve(path.normalize(`${this.workingDirectory}${path.sep}${projectDirectoryName}`));

            if (projectAbsolutePath) {
              this.deleteDirectory(projectAbsolutePath).then((success) => {
                this.createDirectory(projectAbsolutePath).then((success) => {
                  console.log(chalk.green(success));
                  this.cloneProjectTemplate(projectTemplate, projectAbsolutePath).then((success) => {
                    console.log(chalk.green(success));
                    this.installProjectDependencies(projectAbsolutePath).then((success) => {
                      if (success) {
                        console.log(chalk.green(success));
                      };
                      resolve(messages.done.command.create);
                    }, (error) => {
                      if (error) {
                        console.log(chalk.red(error));
                      }
                      this.deleteDirectory(projectAbsolutePath, true).then((success) => {
                        reject(messages.error.command.create);
                      }, (error) => {
                        reject(messages.error.command.create);
                      });
                    });
                  }, (error) => {
                    if (error) {
                      console.log(chalk.red(error));
                    };
                    this.deleteDirectory(projectAbsolutePath, true).then((success) => {
                      reject(messages.error.command.create);
                    }, (error) => {
                      reject(messages.error.command.create);
                    });
                  });
                }, (error) => {
                  if (error) {
                    console.log(chalk.red(error));
                  };
                  reject(messages.error.command.create);
                });
              }, (error) => {
                if (error) {
                  console.log(chalk.yellow(error));
                };
                reject(messages.error.command.create);
              });
            } else {
              console.log(chalk.red(messages.error.directory.resolve));
              reject(messages.error.command.create);
            }
          } else {
            console.log(chalk.red(messages.error.argument.missing));
            reject(messages.error.command.create);
          }
        } else {
          console.log(chalk.red(messages.error.argument.missing));
          reject(messages.error.command.create);
        }
      });
    };

    this.installProjectDependencies = function(projectAbsolutePath) {
      return new Promise((resolve, reject) => {
        var command = `cd ${projectAbsolutePath} && npm install`;

        var spinner = ora({
          text: chalk.gray(messages.info.dependencies.install),
          spinner: 'pong',
          color: 'grey'
        });

        spinner.start();

        childProcess.exec(command, (error, stdout, stderr) => {
          if (error) {
            spinner.fail(chalk.red(messages.info.dependencies.install));
            reject(error);
          } else {
            if (stderr) {
              spinner.fail(chalk.red(messages.info.dependencies.install));
              reject(stderr);
            } else {
              spinner.succeed(chalk.green(messages.info.dependencies.install));
              resolve(messages.done.dependencies.install);
            }
          }
        });
      });
    };

    this.cloneProjectTemplate = function(projectTemplate, projectAbsolutePath) {
      console.log(chalk.gray(messages.info.template.clone));
 
      return new Promise((resolve, reject) => {
        if (templates[projectTemplate]) {
          simpleGit().clone(templates[projectTemplate], projectAbsolutePath).then((error, success) => {
            if (error) {
              console.log(chalk.red(error));
              reject(messages.error.template.clone);
            } else {
              resolve(messages.done.template.cloned);
            }
          });
        } else {
          reject(messages.error.template.notFound);
        }
      });
    };

  };

  Create.prototype = command;

  return new Create();
})();