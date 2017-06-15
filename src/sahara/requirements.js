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
    this.versions = {};
    this.platform = {}

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        this.getNodeVersion()
        .then((nodeVersion) => {
          this.getGitVersion()
          .then((gitVersion) => {
            this.versions.git = gitVersion;
            this.versions.node = nodeVersion;
            this.platform.current = process.platform;
            this.platform.architecture = process.arch;
            return resolve(messages.done.command.requirements);
          }, (error) => {
            if (error) {
              this.logger.error(error);
            }
            return reject(messages.error.command.requirements);
          });
        }, (error) => {
          if (error) {
            this.logger.error(error);
          }
          return reject(messages.error.command.requirements);
        });
      });
    };

    this.execFile = function(file, args) {
      if (!Array.isArray(args)) {
        args = args || [];
      }
      return new Promise((resolve, reject) => {
        childProcess.execFile(file, args, (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          } else {
            if (stderr) {
              return reject(stderr);
            } else {
              return resolve(stdout);
            }
          }
        });
      });
    };

    this.getGitVersion = function() {
      return new Promise((resolve, reject) => {
        this.execFile('git', ['--version']).then((output) => {
          let matches = output.match(/(\d+)\.(\d+)\.(\d+)/i);
          if (matches && matches.length) {
            let version = parseFloat(matches[0]);
            if (!isNaN(version)) {
              this.versions.git = version;
              this.logger.info(messages.info.requirements.programVersion, 'git', version);
              return resolve(version);
            }
          }
          return reject(messages.error.requirements.versionNotFound.replace(/%s/g, 'git'));
        }, (error) => {
          if (error) {
            this.logger.error(error);
          }
          return reject(messages.error.requirements.programNotFound.replace(/%s/g, 'git'));
        });
      });
    };

    this.getNodeVersion = function() {
      return new Promise((resolve, reject) => {
        this.execFile('node', ['--version']).then((output) => {
          let matches = output.match(/(\d+)\.(\d+)\.(\d+)/i);
          if (matches && matches.length) {
            let version = parseFloat(matches[0]);
            if (!isNaN(version)) {
              this.versions.node = version;
              this.logger.info(messages.info.requirements.programVersion, 'node', version)
              return resolve(version);
            }
          }
          return reject(messages.error.requirements.versionNotFound.replace(/%s/g, 'node'));
        }, (error) => {
          if (error) {
            this.logger.error(error);
          }
          return reject(messages.error.requirements.programNotFound.replace(/%s/g, 'node'));
        });
      });
    };
  };

  Requirements.prototype = command;

  return new Requirements();
}());
