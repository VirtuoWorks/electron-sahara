'use strict';

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function() {
  let Help = function() {
    this.helpFilesFolder = path.normalize(this.saharaDirectory + path.sep + 'help');

    this.exec = function(args) {
      return new Promise((resolve, reject) => {
        let command = 'sahara';
        if (Array.isArray(args) && args.length > 0) {
          command = args.shift() || 'sahara';
        }

        if (this.cliOptions.version) {
          let packageFile = require('../../package.json');
          return resolve(packageFile.version);
        } else {
          let filePath = this.helpFilesFolder + path.sep + command;
          fs.readFile(filePath, (error, data) => {
            if (error) {
              filePath = this.helpFilesFolder + path.sep + 'sahara';
              fs.readFile(filePath, (error, data) => {
                if (error) {
                  console.log(chalk.red(messages.error.help.missingSaharaHelpFile));
                  return reject(error);
                } else {
                  return resolve(data.toString());
                }
              });
            } else {
              if (data.toString()) {
                return resolve(data.toString());
              } else {
                filePath = this.helpFilesFolder + path.sep + 'sahara';
                fs.readFile(filePath, (error, data) => {
                  if (error) {
                    console.log(chalk.red(messages.error.help.missingSaharaHelpFile));
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

  return new Help();
}());
