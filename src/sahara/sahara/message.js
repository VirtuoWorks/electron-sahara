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
const messages = require('./message/messages');

/**
 * Expose `message` object.
 * @public
 */
module.exports = (function() {
  const Message = function() {
    this.get = function(xPath) {
      const defaultMessage = 'An event occured but no message found to describe it...';

      if (!this.isObject(xPath)) {
        return defaultMessage;
      }

      const typeName = xPath.type;
      const commandName = xPath.command;
      const messageName = xPath.message;
      const replacement = xPath.replacement;

      if (typeName && messages[typeName]) {
        const type = messages[typeName];
        if (this.isString(type)) {
          return this.replace(type, replacement);
        }

        if (commandName && type[commandName]) {
          const command = type[commandName];
          if (this.isString(command)) {
            return this.replace(command, replacement);
          }

          if (messageName && command[messageName]) {
            const message = command[messageName];
            if (this.isString(message)) {
              return this.replace(message, replacement);
            }
          }
        }

        if (messageName && type[messageName]) {
          const message = type[messageName];
          if (this.isString(message)) {
            return this.replace(message, replacement);
          }
        }
      }

      return defaultMessage;
    };

    this.replace = function(string, replacement) {
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