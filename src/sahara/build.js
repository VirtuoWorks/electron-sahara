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

// Electron Sahara modules.
const command = require('./sahara');
const prepare = require('./prepare');
const compile = require('./compile');
const message = require('./sahara/message');

/**
 * Expose `Build` object.
 * @public
 */
module.exports = (function() {
  const Build = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args)) {
          if (this.options) {
            let platform;
            if (!args.length) {
              platform = process.platform;
              this.logger.debug(message.get({
                type: 'info',
                command: 'platform',
                message: 'current'
              }), platform);
            } else {
              platform = args.shift();
            }

            return prepare.exec([platform])
                .then((success) => {
                  this.logger.info(success);
                  return compile.exec([platform]);
                })
                .then((success) => {
                  this.logger.info(success);
                  return resolve(message.get({
                    type: 'done',
                    command: 'build',
                    message: 'success'
                  }));
                })
                .catch((error) => {
                  this.logger.error(error);
                  return reject(message.get({
                    type: 'error',
                    command: 'build',
                    message: 'failure'
                  }));
                });
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
          command: 'build',
          message: 'failure'
        }));
      });
    };
  };

  Build.prototype = command;

  return new Build();
}());
