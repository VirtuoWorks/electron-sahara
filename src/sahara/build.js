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
const prepare = require('./prepare');
const compile = require('./compile');
const messages = require('./sahara/messages');

/**
 * Expose `Build` object.
 * @public
 */
const build = module.exports = (function() {
  let Build = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args)) {
          if (this.options) {
            let platform = args.shift() || process.platform;

            if (!args.length) {
              this.logger.debug(messages.info.platform.current, platform);
            }

            prepare.exec([platform])
            .then((success) => {
              if (success) {
                this.logger.info(success);
              }
              compile.exec([platform])
              .then((success) => {
                if (success) {
                  this.logger.info(success);
                }
                return resolve(messages.done.command.build);
              }, (error) => {
                if (error) {
                  this.logger.error(error);
                }
                return reject(messages.error.command.build);
              });
            }, (error) => {
              if (error) {
                this.logger.error(error);
              }
              return reject(messages.error.command.build);
            });
          } else {
            this.logger.error(messages.error.sahara.notAProjectDirectory);
            return reject(messages.error.command.build);
          }
        } else {
          this.logger.error(messages.error.argument.missing);
          return reject(messages.error.command.build);
        }
      });
    };
  };

  Build.prototype = command;

  return new Build();
}());
