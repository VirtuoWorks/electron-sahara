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
    this.get = function({topic: topicName, command: commandName, message: messageName, replacement: replacement}) {
      if (messages[topicName]) {
        let topic = messages[topicName];
        if (commandName) {
          if (topic[commandName]) {
            let command = topic[commandName];
            if (command[messageName]) {
              if (replacement) {
                return command[messageName].replace(/%s/g, replacement);
              } else {
                return command[messageName];
              }
            } else {
              return command;
            }
          } else {
            return topic;
          }
        }
      } else {
        if (topic[messageName]) {
          if (replacement) {
            return topic[messageName].replace(/%s/g, replacement);
          } else {
            return topic[messageName];
          }
        }
      }
    };
  };

  return new Message();
}());