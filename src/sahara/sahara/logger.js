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

// Third party modules.
const chalk = require('chalk');
const winston = require('winston');

const logger = module.exports = (function() {

  let config = {
    levels: {
      emerg: 0,     // Emergency: system is unusable.
      alert: 1,     // Alert: action must be taken immediately.
      crit: 2,      // Critical: critical conditions.
      error: 3,     // Error: error conditions.
      warning: 4,   // Warning: warning conditions.
      notice: 5,    // Notice: normal but significant condition.
      info: 6,      // Informational: informational messages.
      debug: 7      // Debug: debug-level messages.
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

  let setLogLevel = function (logger, options) {
    Object.defineProperty(logger.transports.console, 'level', (function() {
      let consoleLogLevel = 'info';
      let descriptor = Object.getOwnPropertyDescriptor(logger.transports.console, 'level');

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

    let logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          colorize: 'all',
          showLevel: false
        })
      ],
      levels: config.levels,
      colors: config.colors
    });

    winston.addColors(config.colors);

    setLogLevel(logger, options);

    return logger;
  };
}());