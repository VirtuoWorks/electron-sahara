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

// Electron Sahara modules.
const command = require('./sahara');
const messages = require('./sahara/messages');

/**
 * Expose `Platform` object.
 * @public
 */
const platform = module.exports = (function() {
  let Platform = function() {
    this.electronPackager;

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args)) {
          let action = args.shift();
          let platform = args.shift() || process.platform;

          if (!args.length) {
            this.logger.debug(messages.info.platform.current, platform);
          }

          if (this[`${action}Platform`]) {
            this[`${action}Platform`](platform)
            .then((success) => {
              if (success) {
                this.logger.info(success);
              }
              return resolve(messages.done.command.platform);
            }, (error) => {
              if (error) {
                this.logger.error(error);
              }
              return reject(messages.error.command.platform);
            });
          } else {
            this.logger.error(messages.error.action.invalid);
            return reject(messages.error.command.platform);
          }
        } else {
          this.logger.error(messages.error.argument.missing);
          return reject(messages.error.command.platform);
        }
      });
    };

    this.addPlatform = function(platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        return reject(messages.error.action.notImplemented);
      });
    };

    this.removePlatform = function(platform) {
      return new Promise((resolve, reject) => {
        // TODO !!!
        return reject(messages.error.action.notImplemented);
      });
    };
  };

  Platform.prototype = command;

  return new Platform();
}());
