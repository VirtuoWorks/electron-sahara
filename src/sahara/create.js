'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
  
const ora = require('ora');
const del = require('del');
const chalk = require('chalk');
const prompt = require('prompt');
const simpleGit = require('simple-git');

const command = require('./sahara');
const messages = require('../messages/messages');
const templates = require('../templates/templates');

exports = module.exports = (function(){

  var Create = function(){

    this.cmd;
    this.mkdir;
    this.folder;
    this.spinner;
    this.template;

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {

          this.folder = args.shift();
          this.template = args.shift();
          if (this.template === '-f') {
             this.force = '-f';
             this.template = 'vanilla';
          } else {
             this.force = args.shift();
          };

          if (this.folder) {
            this.mkdir = path.resolve(path.normalize(`${this.workingDirectory}${path.sep}${this.folder}`));
            if (this.folder != this.mkdir) {
              this.removeFolder().then((success) => {
                this.createFolder().then((success) => {
                  this.cloneTemplate().then((success) => {
                    resolve(success);
                  }, (error) => {
                    reject(error);
                  });
                }, (error) => {
                  if (error) {
                    console.log(chalk.red(error.message));
                  };
                  reject(messages.error.folder.create);
                });
              }, (error) => { 
                if (error) {
                  console.log(chalk.yellow(error));
                };
                reject(messages.error.folder.create);
              });
            } else {
              reject(messages.error.folder.resolve);
            }
          } else {
            reject(messages.error.argument.missing);
          }
        } else {
          reject(messages.error.argument.missing);
        }
      });
    };

    this.installDependencies = function() {
      console.log(chalk.gray(messages.info.dependencies.install));
      return new Promise((resolve, reject) => {
        reject();
      });
    };

    this.createFolder = function (mkdir) {
      var mkdir = mkdir || this.mkdir;

      console.log(chalk.gray(messages.info.folder.create));
      return new Promise((resolve, reject) => {
        if (mkdir) {
          fs.access(mkdir, (error) => {
            if (error) {
              fs.mkdir(mkdir, (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                };
              });
            } else {
              resolve();
            };
          });
        } else {
          reject();
        }
      });
    };

    this.cloneTemplate = function(template, mkdir) {
      var mkdir = mkdir || this.mkdir
      var template = template || this.template;

      var spinner = ora({
        text: chalk.gray(messages.info.template.clone),
        spinner: 'pong',
      });
      spinner.start();
 
      return new Promise((resolve, reject) => {
        if (templates[template]) {
          simpleGit().outputHandler((command, stdout, stderr) => {
            if (stderr) {
              if (stderr) {
                spinner.fail(chalk.red(messages.info.template.clone));
                var error = '';
                stderr.on('data', (chunk) => {
                  error += chunk;
                });
                stderr.on('end', () => {
                  error = error.toString();
                  reject(`${message} ${error}`);
                });
              } else {
                spinner.fail(chalk.red(messages.info.template.clone));
                reject(messages.error.template.clone);
              }
            } else {
              if (stdout) {
                spinner.succeed(chalk.green(messages.info.template.clone));
                stdout.on('end', () => {
                  resolve(messages.success.command.create);
                });
              } else {
                spinner.succeed(chalk.green(messages.info.template.clone));
                resolve(messages.success.command.create);
              }
            }
          }).silent(true).clone(templates[template], mkdir);
        } else {
          spinner.fail(chalk.red(messages.info.template.clone));
          reject(messages.error.template.notFound);
        }
      });
    };

    this.removeFolder = function(mkdir) {
      var force = ((this.mkdir && this.force && this.force === '-f') || !!mkdir);
      var mkdir = mkdir || this.mkdir;

      if (force) {
        console.log(chalk.gray(messages.info.folder.deletion));
        return new Promise((resolve, reject) => {
          if (this.folder != this.mkdir) {
            del([this.mkdir], {dryRun: true}).then((paths) => {
              if (paths.length) {
                prompt.start();
                prompt.get({
                  description: messages.prompt.folder.deletion + paths.join(', '),
                  type: 'string',
                  pattern: /^(y|yes|n|no)$/i,
                  message: 'Wrong input',
                  required: true
                }, (error, result) => {
                  if (error) {
                    reject(messages.error.command.aborted);
                  } else {
                    if (result.question) {
                      if (result.question.toLowerCase()[0] == 'y') {
                        var spinner = ora({
                          text: chalk.gray(messages.info.folder.deletion),
                          spinner: 'pong',
                          color: 'grey'
                        });
                        spinner.start();
                        del([mkdir]).then((paths) => {
                          spinner.succeed(chalk.green(messages.info.folder.deletion));
                          resolve(messages.error.folder.deletion);
                        }).catch(function(error){
                          spinner.succeed(chalk.red(messages.info.folder.deletion));
                          reject(messages.error.folder.deletion);
                        });
                      } else {
                        reject(messages.error.command.aborted);
                      }
                    } else {
                      reject(messages.error.command.aborted);
                    }
                  };
                });
              } else {
                resolve();
              };
            }).catch(function(error){
              reject(messages.error.folder.deletion);
            });
          } else {
            reject(messages.error.folder.deletion);
          }
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      };
    };

  };

  Create.prototype = command;

  return new Create();
})();