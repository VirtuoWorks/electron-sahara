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

// Core modules.
const fs = require('fs');
const path = require('path');

// Electron Sahara modules.
const command = require('./sahara');
const message = require('./sahara/message');

/**
 * Expose `Help` object.
 * @public
 */
module.exports = (function() {
  const Help = function() {
    this.helpFilesDirectory = path.normalize(this.dir + path.sep + 'help');

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        let command = 'sahara';
        if (Array.isArray(args) && args.length > 0) {
          command = args.shift() || 'sahara';
        }

        if (this.cliOptions.version) {
          const packageFile = require('../../package.json');
          return resolve(packageFile.version);
        } else {
          let filePath = this.helpFilesDirectory + path.sep + command;
          fs.readFile(filePath, (error, data) => {
            if (error) {
              filePath = this.helpFilesDirectory + path.sep + 'sahara';
              fs.readFile(filePath, (error, data) => {
                if (error) {
                  this.logger.error(message.get({
                    type: 'error',
                    command: 'help',
                    message: 'missingSaharaHelpFile'
                  }));
                  return reject(error);
                } else {
                  return resolve(data.toString());
                }
              });
            } else {
              if (data.toString()) {
                return resolve(data.toString());
              } else {
                filePath = this.helpFilesDirectory + path.sep + 'sahara';
                fs.readFile(filePath, (error, data) => {
                  if (error) {
                    this.logger.error(message.get({
                      type: 'error',
                      command: 'help',
                      message: 'missingSaharaHelpFile'
                    }));
                    return reject(error);
                  } else {
                    return resolve(data.toString());
                  }
                });
              }
            }
          });
        }
      });
    };
  };

  Help.prototype = command;
  Help.prototype.constructor = Help;

  return new Help();
}());
