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
const path = require('path');

// Electron Sahara modules.
const command = require('./sahara');
const message = require('./sahara/message');

/**
 * Expose `Clean` object.
 * @public
 */
const clean = module.exports = (function() {
  let Clean = function() {

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

            let toDelete = [];
            if (platform === 'all') {
              toDelete.push('platforms' + path.sep + 'win32' + path.sep + 'build');
              toDelete.push('platforms' + path.sep + 'linux' + path.sep + 'build');
              toDelete.push('platforms' + path.sep + 'darwin' + path.sep + 'build');
            } else {
              toDelete.push('platforms' + path.sep + platform + path.sep + 'build');
            }

            let iterable = [];
            toDelete.forEach((path, index) => {
              iterable.push(new Promise((resolve, reject) => {
                return this.getAbsolutePathTo(path)
                .then((absolutePath) => {
                  return this.deleteDirectory(absolutePath, true);
                })
                .then((success) => {
                  success && this.logger.info(success);
                  return resolve();
                })
                .catch((error) => {
                  error && this.logger.debug(error);
                  return resolve();
                });
              }));
            });

            return Promise.all(iterable).then(() => {
              return resolve(message.get({
                type: 'done',
                command: 'clean',
                message: 'success'
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
          command: 'clean',
          message: 'failure'
        }));
      });
    };

  };

  Clean.prototype = command;

  return new Clean();
}());
