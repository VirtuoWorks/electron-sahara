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
const childProcess = require('child_process');

// Electron Sahara modules.
const command = require('./sahara');
const messages = require('./sahara/messages');

/**
 * Expose `Requirements` object.
 * @public
 */
const requirements = module.exports = (function() {
  let Requirements = function() {
    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        childProcess.exec('git', , (error, stdout, stderr) => {
          if (error) {
            console.log(error);
            return reject();
          } else {
            if (stderr) {
              console.log(stderr);
              return reject();
            } else {
              console.log(stdout);
              return resolve();
            }
          }
        });
        /*if (Array.isArray(args) && args.length > 0) {
          
        }*/
      });
    };
  };

  Requirements.prototype = command;

  return new Requirements();
}());
