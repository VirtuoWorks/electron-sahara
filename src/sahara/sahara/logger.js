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

// Third party modules.
const winston = require('winston');

module.exports = (function() {

  const config = {
    levels: {
      emerg: 0, // Emergency: system is unusable.
      alert: 1, // Alert: action must be taken immediately.
      crit: 2, // Critical: critical conditions.
      error: 3, // Error: error conditions.
      warning: 4, // Warning: warning conditions.
      notice: 5, // Notice: normal but significant condition.
      info: 6, // Informational: informational messages.
      debug: 7 // Debug: debug-level messages.
    },
    colors: {
      emerg: 'bgRed',
      alert: 'bgRed',
      crit: 'bgRed',
      error: 'bgRed',
      warning: 'red',
      notice: 'bgYellow',
      info: 'yellow',
      debug: 'grey'
    }
  };

  const setLogLevel = function(logger, options) {
    Object.defineProperty(logger.transports[0], 'level', (function() {
      let consoleLogLevel = 'info';
      const descriptor = Object.getOwnPropertyDescriptor(logger.transports[0], 'level');

      if (descriptor.hasOwnProperty('value')) {
        delete descriptor.value;
      }

      if (descriptor.hasOwnProperty('writable')) {
        delete descriptor.writable;
      }

      descriptor.get = function() {
        if (typeof options === 'object') {
          if (options.verbose) {
            return 'debug';
          }
        } else {
          return consoleLogLevel;
        }
      };

      descriptor.set = function(value) {
        if (value === 'debug') {
          consoleLogLevel = 'debug';
          options.verbose = true;
        } else {
          consoleLogLevel = value;
        }
      };

      return descriptor;
    }()));
  };

  return function(options) {
    options = options || {};

    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
              winston.format.splat(),
              winston.format.cli({
                all: true
              }),
              winston.format.printf((log) => {
                return `${log.message}`;
              })
          )
        })
      ],
      levels: config.levels
    });

    winston.addColors(config.colors);

    setLogLevel(logger, options);

    return logger;
  };
}());
