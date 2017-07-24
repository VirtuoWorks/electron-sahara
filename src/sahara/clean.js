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
const messages = require('./sahara/messages');

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
            let toDelete = [];
            let platform = args.shift() || process.platform;

            if (!args.length) {
              this.logger.debug(messages.info.platform.current, platform);
            }

            if (platform === 'all') {
              toDelete.push('platforms' + path.sep + 'win32' + path.sep + 'build');
              toDelete.push('platforms' + path.sep + 'linux' + path.sep + 'build');
              toDelete.push('platforms' + path.sep + 'darwin' + path.sep + 'build');
            } else {
              toDelete.push('platforms' + path.sep + platform + path.sep + 'build');
            }

            toDelete.forEach((path, index) => {
              this.getAbsolutePathTo(path, true)
              .then((absolutePath) => {
                this.logger.info(absolutePath);
                this.deleteDirectory(absolutePath).then((success) => {
                  if (success) {
                    this.logger.info(success);
                  }
                }, (error) => {
                  if (error) {
                    this.logger.debug(error);
                  }
                });
              }, (error) => {
                if (error) {
                  this.logger.debug(error);
                }
                return reject(messages.error.command.clean);
              });
            });
            return resolve(messages.done.command.clean);
          } else {
            this.logger.error(messages.error.sahara.notAProjectDirectory);
            return reject(messages.error.command.clean);
          }
        } else {
          this.logger.error(messages.error.argument.missing);
          return reject(messages.error.command.clean);
        }
      });
    };

  };

  Clean.prototype = command;

  return new Clean();
}());
