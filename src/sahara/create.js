/* !
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
const childProcess = require('child_process');

// Third party modules.
const ora = require('ora');
const chalk = require('chalk');
const simpleGit = require('simple-git');

// Electron Sahara modules.
const command = require('./sahara');
const message = require('./sahara/message');
const templates = require('./create/templates');

/**
 * Expose `Create` object.
 * @public
 */
const create = module.exports = (function() {
  let Create = function() {
    this.apiCall;

    this.exec = function(args, apiCall) {
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (!this.options) {
            let projectDirectoryName = args.shift();
            let projectTemplate = args.shift() || 'vanilla';
            if (projectDirectoryName) {
              return this.getAbsolutePathTo(projectDirectoryName)
              .then((projectAbsolutePath) => {
                return this.deleteDirectory(projectAbsolutePath)
                .then((success) => {
                  this.logger.info(success);
                  this.createDirectory(projectAbsolutePath)
                  .then((success) => {
                    this.logger.info(success);
                    return this.cloneProjectTemplate(projectTemplate, projectAbsolutePath);
                  })
                  .then((success) => {
                    this.logger.info(success);
                    return this.installProjectDependencies(projectAbsolutePath);
                  })
                  .then((success) => {
                    this.logger.info(success);
                    return resolve(message.get({
                      type: 'done',
                      command: 'create',
                      message: 'success'
                    }));
                  })
                  .catch((error) => {
                    this.logger.error(error);
                    return this.deleteDirectory(projectAbsolutePath, true);
                  })
                  .then((success) => {
                    this.logger.info(success);
                    return reject(message.get({
                      type: 'error',
                      command: 'create',
                      message: 'failure'
                    }));
                  })
                  .catch((error) => {
                    this.logger.error(error);
                    return reject(message.get({
                      type: 'error',
                      command: 'create',
                      message: 'failure'
                    }));
                  });
                })
                .catch((error) => {
                  this.logger.error(error);
                  return reject(message.get({
                    type: 'error',
                    command: 'create',
                    message: 'failure'
                  }));
                });
              })
              .catch((error) => {
                this.logger.error(error);
                return reject(message.get({
                  type: 'error',
                  command: 'create',
                  message: 'failure'
                }));
              });
            } else {
              this.logger.error(message.get({
                type: 'error',
                command: 'argument',
                message: 'missing'
              }));
            }
          } else {
            this.logger.error(message.get({
              type: 'error',
              command: 'sahara',
              message: 'projectDirectory'
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
          command: 'create',
          message: 'failure'
        }));
      });
    };

    this.installProjectDependencies = function(projectAbsolutePath) {
      return new Promise((resolve, reject) => {
        let command = `cd ${projectAbsolutePath} && npm install`;

        let spinner = ora({
          text: chalk.yellow(message.get({
            type: 'info',
            command: 'dependencies',
            message: 'install'
          })),
          spinner: 'pong',
          color: 'yellow'
        });

        spinner.start();

        childProcess.exec(command, (error, stdout, stderr) => {
          if (error) {
            spinner.fail(chalk.red(message.get({
              type: 'info',
              command: 'dependencies',
              message: 'install'
            })));
            return reject(error);
          } else {
            if (stderr) {
              // To prevent failure while using npm >= 5.0.0.
              if (stderr.indexOf('npm notice created a lockfile as package-lock.json. You should commit this file.') !== -1) {
                spinner.succeed(chalk.green(message.get({
                  type: 'info',
                  command: 'dependencies',
                  message: 'install'
                })));
                return resolve(message.get({
                  type: 'done',
                  command: 'dependencies',
                  message: 'install'
                }));
              } else {
                spinner.fail(chalk.red(message.get({
                  type: 'info',
                  command: 'dependencies',
                  message: 'install'
                })));
                return reject(stderr);
              }
            } else {
              spinner.succeed(chalk.green(message.get({
                type: 'info',
                command: 'dependencies',
                message: 'install'
              })));
              return resolve(message.get({
                type: 'done',
                command: 'dependencies',
                message: 'install'
              }));
            }
          }
        });
      });
    };

    this.cloneProjectTemplate = function(projectTemplate, projectAbsolutePath) {
      this.logger.debug(message.get({
        type: 'info',
        command: 'template',
        message: 'clone'
      }));

      return new Promise((resolve, reject) => {
        if (templates[projectTemplate]) {
          simpleGit().clone(templates[projectTemplate], projectAbsolutePath)
          .then((error, success) => {
            if (error) {
              this.logger.error(error);
              return reject(message.get({
                type: 'error',
                command: 'template',
                message: 'clone'
              }));
            } else {
              return resolve(message.get({
                type: 'done',
                command: 'template',
                message: 'cloned'
              }));
            }
          });
        } else {
          return reject(message.get({
            type: 'error',
            command: 'template',
            message: 'notFound'
          }));
        }
      });
    };
  };

  Create.prototype = command;

  return new Create();
}());
