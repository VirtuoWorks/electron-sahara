'use strict';

const fs = require('fs');
const path = require('path');

const command = require('./sahara');
const messages = require('./sahara/messages');

exports = module.exports = (function(){

  var Help = function(){

    this.helpFilesFolder = path.normalize(this.saharaDirectory + path.sep + 'help');

    this.exec = function(args){
      return new Promise((resolve, reject) => {
        var command = 'sahara';
        if (Array.isArray(args) && args.length > 0) {
          command = args.shift() || 'sahara';
        }

        var filePath;
        switch (command) {
          case '-v':
            var packageFile = require('../../package.json');
            resolve(packageFile.version);
            return;
          break;
          default:
            var filePath = this.helpFilesFolder + path.sep + command;
        }

        fs.readFile(filePath, (error, data) => {
          if (error) {
            filePath = this.helpFilesFolder + path.sep + 'sahara';
            fs.readFile(filePath, (error, data) => {
              if (error) {
                this.cliOptions.verbose && console.log(chalk.red(messages.error.help.missingSaharaHelpFile));
                reject(error);
              } else {
                resolve(data.toString());
              };
            });
          } else {
            if (data.toString()) {
              resolve(data.toString());
            } else {
              filePath = this.helpFilesFolder + path.sep + 'sahara';
              fs.readFile(filePath, (error, data) => {
                if (error) {
                  this.cliOptions.verbose && console.log(chalk.red(messages.error.help.missingSaharaHelpFile));
                  reject(error);
                } else {
                  resolve(data.toString());
                };
              });
            }
          };
        });
      });
    };
  };

  Help.prototype = command;

  return new Help();
})();