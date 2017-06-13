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
const prepare = require('./prepare');
const compile = require('./compile');
const command = require('./sahara');
const messages = require('./sahara/messages');

/**
 * Expose `Build` object.
 * @public
 */
const build = module.exports = (function() {
  let Build = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(args) && args.length > 0) {
          if (this.settings) {
            let platform = args.shift() || process.platform;

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
