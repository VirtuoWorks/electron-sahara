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
const message = require('./sahara/message');

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
        this.platform.current = process.platform;
        this.platform.architecture = process.arch;
        return Promise.all([this.getGitVersion(), this.getNodeVersion()])
        .then(([git, node]) => {
          this.versions.git = git;
          this.versions.node = node;
          return resolve(message.get({
            topic: 'done',
            command: 'requirements',
            message: 'success'
          }));
        })
        .catch((error) => {
          this.logger.error(error);
          return reject(message.get({
            topic: 'done',
            command: 'requirements',
            message: 'failure'
          }));
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
              this.logger.info(message.get({
                topic: 'info',
                command: 'requirements',
                message: 'programVersion'
              }), 'git', version);
              return resolve(version);
            }
          }
          return reject(message.get({
            topic: 'error',
            command: 'requirements',
            message: 'versionNotFound',
            replacement: 'git'
          }));
        }, (error) => {
          if (error) {
            this.logger.error(error);
          }
          return reject(message.get({
            topic: 'error',
            command: 'requirements',
            message: 'programNotFound',
            replacement: 'git'
          }));
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
              this.logger.info(message.get({
                topic: 'info',
                command: 'requirements',
                message: 'programVersion'
              }), 'node', version);
              return resolve(version);
            }
          }
          return reject(message.get({
            topic: 'error',
            command: 'requirements',
            message: 'versionNotFound',
            replacement: 'node'
          }));
        }, (error) => {
          if (error) {
            this.logger.error(error);
          }
          return reject(message.get({
            topic: 'error',
            command: 'requirements',
            message: 'programNotFound',
            replacement: 'node'
          }));
        });
      });
    };
  };

  Requirements.prototype = command;

  return new Requirements();
}());
