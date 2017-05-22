'use strict';

const fs = require('fs');
const chalk = require('chalk');

const messages = require('./messages/messages');

exports = module.exports = (function(argv){

  var cli = function() {

    var Cli = function(){
      this.args;
      this.argv;
      this.command;
      this.apiCall;
    };

    Cli.prototype.exec = function(argv) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(argv) && argv.length > 2) {
          console.log(chalk.gray(messages.info.exec));

          this.argv = argv || process.argv;

          if (this[this.argv[2]]) {
            this.command = this.argv[2];
            this.args = this.argv.slice(3,this.argv.length) || [];
            if (this.args.length) {
                if (fs.existsSync(`${__dirname}/sahara/${this.command}.js`)) {
                  console.log(chalk.gray(messages.info.command[this.command]));
                  require(`./sahara/${this.command}.js`).exec(this.args, this.apiCall).then((success) => {
                    resolve(success);
                  }, (error) => {
                    reject(error);
                  });
                } else {
                  require('./sahara/help').exec(argv, this.apiCall).then((success) => {
                    resolve(success);
                  }, (error) => {
                    reject(error);
                  });
                }
            } else {
              console.log(chalk.red(messages.error.argument.missing));
              require('./sahara/help').exec(this.args, this.apiCall).then((success) => {
                resolve(success);
              }, (error) => {
                reject(error);
              });
            }
          } else {
            console.log(chalk.red(messages.error.command.notFound));
            require('./sahara/help').exec(argv, this.apiCall).then((success) => {
              resolve(success);
            }, (error) => {
              reject(error);
            });
          };
        } else {
          require('./sahara/help').exec(argv, this.apiCall).then((success) => {
            resolve(success);
          }, (error) => {
            reject(error);
          });
        };
      });
    };

    // sahara create <command>
    // Create a project
    Cli.prototype.create = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','create'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara start <command>
    // Start your project
    Cli.prototype.start = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','start'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara help <command>
    // Get help for a command
    Cli.prototype.help = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','help'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara info <command>
    // Generate project information
    Cli.prototype.info = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','info'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };
 
    // sahara requirements <command>
    // Checks and print out all the requirements for specified platforms 
    Cli.prototype.requirements = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','requirements'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };
 
    // sahara platform <command>
    // Manage project platforms
    Cli.prototype.platform = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','platform'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara prepare <command>
    // Copy files into platform(s) for building
    Cli.prototype.prepare = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','prepare'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara compile <command>
    // Build platform(s)
    Cli.prototype.compile = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','compile'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara prepare && sahara compile
    Cli.prototype.build = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','build'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara clean <command>
    // Cleanup project from build artifacts
    Cli.prototype.clean = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','clean'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    // sahara run <command>
    // Run project (including prepare && compile)
    Cli.prototype.run = function(args){
      return new Promise((resolve, reject) => {
        this.exec(['','','run'].concat(args)).then((success) => {
          resolve(success);
        }, (error) => {
          reject(error);
        });
      });
    };

    return new Cli();
  };

  return function(argv) {
    var sahara = cli();
    if (Array.isArray(argv) && argv.length) {
      sahara.exec(argv).then((success) => {
        if (success) {
          console.log(chalk.green(success));
        }
      }, (error) => {
        if (error) {
          console.log(chalk.red(error));
        }
      });
    };
    sahara.apiCall = true;
    return sahara;
  };
})();