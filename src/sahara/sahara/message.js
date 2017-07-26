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
const messages = require('./message/messages');

/**
 * Expose `message` object.
 * @public
 */
const message = module.exports = (function() {
  let Message = function() {
    this.get = function(xPath) {
      let defaultMessage = 'An event occured but no message found to describe it...';

      if (!this.isObject(xPath)) {
        return defaultMessage;
      }

      let typeName = xPath.type;
      let commandName = xPath.command;
      let messageName = xPath.message;
      let replacement = xPath.replacement;

      if (messages[typeName]) {
        let type = messages[typeName];
        if (this.isString(type)) {
          return this.replace(type, replacement);
        }

        if (type[commandName]) {
          let command = type[commandName];
          if (this.isString(command)) {
            return this.replace(command, replacement);
          }

          if (command[messageName]) {
            let message = command[messageName];
            if (this.isString(message)) {
              return this.replace(message, replacement);
            }
          }
        }
      }

      return defaultMessage;
    };

    this.replace = function (string, replacement) {
      if (this.isString(string) && this.isString(replacement)) {
        return string.replace(/%s/g, replacement);
      }
      return string;
    };

    this.isString = function(string) {
      return typeof string === 'string';
    };

    this.isObject = function(object) {
      return object !== null && typeof object === 'object';
    };
  };

  return new Message();
}());