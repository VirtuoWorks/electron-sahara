'use strict';

const fs = require('fs');
const ora = require('ora');
const del = require('del');
const chalk = require('chalk');
const prompt = require('prompt');
const messages = require('../messages/messages');

exports = module.exports = (function(){
  
  var sahara = function(){

    var Sahara = function(){
      this.apiCall;
      this.saharaDirectory;
      this.workingDirectory;
    };

    Sahara.prototype.init = function() {
      this.saharaDirectory = __dirname;
      this.workingDirectory = process.cwd();

      return this;
    };
    
    Sahara.prototype.exec = function(args, apiCall) {
      this.apiCall = apiCall || false;
      return new Promise((resolve, reject) => {
        reject(messages.error.command.notImplemented);
      });
    };

    Sahara.prototype.createDirectory = function (absolutePath) {
      console.log(chalk.gray(messages.info.directory.create));

      return new Promise((resolve, reject) => {
        if (absolutePath) {
          fs.access(absolutePath, (error) => {
            if (error) {
              fs.mkdir(absolutePath, (error) => {
                if (error) {
                  reject(error.message);
                } else {
                  resolve(messages.done.directory.created);
                };
              });
            } else {
              resolve(messages.done.directory.created);
            };
          });
        } else {
          reject(messages.error.directory.create);
        }
      });
    };

    Sahara.prototype.deleteDirectory = function(absolutePath, force) {
      return new Promise((resolve, reject) => {
       del([absolutePath], {dryRun: true}).then((paths) => {
          if (paths.length) {
            if (force || this.apiCall) {
              del([absolutePath]).then((paths) => {
                resolve(messages.info.directory.deletion);
              }).catch(function(error){
                reject(messages.error.directory.deletion);
              });
            } else {
              prompt.start();
              prompt.get({
                description: messages.prompt.directory.deletion.replace(/%s/g, paths.join(', ')),
                type: 'string',
                pattern: /^(y|yes|n|no)$/i,
                message: 'Wrong input',
                required: true
              }, (error, result) => {
                if (error) {
                  reject(messages.error.command.aborted);
                } else {
                  if (result.question) {
                    if (result.question.toLowerCase()[0] == 'y') {
                      var spinner = ora({
                        text: chalk.gray(messages.info.directory.deletion),
                        spinner: 'pong',
                        color: 'grey'
                      });
                      spinner.start();
                      del([absolutePath]).then((paths) => {
                        spinner.succeed(chalk.green(messages.info.directory.deletion));
                        resolve(messages.error.directory.deletion);
                      }).catch(function(error){
                        spinner.fail(chalk.red(messages.info.directory.deletion));
                        reject(messages.error.directory.deletion);
                      });
                    } else {
                      reject(messages.error.command.aborted);
                    }
                  } else {
                    reject(messages.error.command.aborted);
                  }
                };
              });
            };
          } else {
            resolve();
          };
        }).catch(function(error){
          reject(messages.error.directory.deletion);
        });
      });
    };

    return new Sahara();
  };

  var Command = function(){};

  Command.prototype = (function(){
    return sahara().init();
  })();

  return new Command();
})();