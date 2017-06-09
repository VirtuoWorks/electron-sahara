'use strict';

const fs = require('fs');
const chalk = require('chalk');

const options = require('./sahara/sahara/options');
const messages = require('./sahara/sahara/messages');

exports = module.exports = (function(argv) {
  let cli = function() {
    let Cli = function() {
      this.args;
      this.argv;
      this.command;
      this.apiCall;
      this.options = {};
    };

    Cli.prototype.exec = function(argv) {
      this.options.verbose && console.log(chalk.yellow(messages.info.exec));
      return new Promise((resolve, reject) => {
        this.argv = this.extractCliOptionsFrom(argv);
        if (Array.isArray(this.argv) && this.argv.length > 2) {
          if (this[this.argv[2]]) {
            this.command = this.argv[2];
            this.args = this.argv.slice(3, this.argv.length) || [];
            if (this.args.length) {
                if (fs.existsSync(`${__dirname}/sahara/${this.command}.js`)) {
                  this.options.verbose && console.log(chalk.yellow(messages.info.command[this.command]));
                  require(`./sahara/${this.command}.js`)
                  .setCliOptions(this.options)
                  .exec(this.args, this.apiCall)
                  .then((success) => {
                    return resolve(success);
                  }, (error) => {
                    return reject(error);
                  });
                } else {
                  console.log(chalk.red(messages.error.command.notFound));
                  require('./sahara/help')
                  .setCliOptions(this.options)
                  .exec(this.args)
                  .then((success) => {
                    return resolve(success);
                  }, (error) => {
                    return reject(error);
                  });
                }
            } else {
              console.log(chalk.red(messages.error.argument.missing));
              require('./sahara/help')
              .setCliOptions(this.options)
              .exec([this.command])
              .then((success) => {
                return resolve(success);
              }, (error) => {
                return reject(error);
              });
            }
          } else {
            if (this.argv[2]) {
              this.args = this.argv.slice(2, this.argv.length) || [];
            } else {
              console.log(chalk.red(messages.error.command.notFound));
              this.args = [];
            }
            require('./sahara/help').setCliOptions(this.options).exec(this.args).then((success) => {
              return resolve(success);
            }, (error) => {
              return reject(error);
            });
          };
        } else {
          this.args = [];
          require('./sahara/help')
          .setCliOptions(this.options)
          .exec(this.args)
          .then((success) => {
            return resolve(success);
          }, (error) => {
            return reject(error);
          });
        };
      });
    };

    Cli.prototype.extractCliOptionsFrom = function(argv) {
      if (Array.isArray(argv)) {
        let filtered = argv.filter((arg) => {
          if(options[arg]) {
            this.options[options[arg]] = true;
            return false;
          } else {
            return true;
          }
        });
        this.options.verbose && console.log(chalk.yellow(messages.info.sahara.verboseEnabled));
        return filtered;
      } else {
        return argv;
      }
    };

    // sahara create <command>
    // Create a project
    Cli.prototype.create = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'create'].concat(args)).then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara start <command>
    // Start your project
    Cli.prototype.start = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'start'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara help <command>
    // Get help for a command
    Cli.prototype.help = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'help'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara info <command>
    // Generate project information
    Cli.prototype.info = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'info'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara requirements <command>
    // Checks and print out all the requirements for specified platforms
    Cli.prototype.requirements = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'requirements'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara platform <command>
    // Manage project platforms
    Cli.prototype.platform = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'platform'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara prepare <command>
    // Copy files into platform(s) for building
    Cli.prototype.prepare = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'prepare'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara compile <command>
    // Build platform(s)
    Cli.prototype.compile = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'compile'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara prepare && sahara compile
    Cli.prototype.build = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'build'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara clean <command>
    // Cleanup project from build artifacts
    Cli.prototype.clean = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'clean'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    // sahara run <command>
    // Run project (including prepare && compile)
    Cli.prototype.run = function(args) {
      return new Promise((resolve, reject) => {
        this.exec(['', '', 'run'].concat(args))
        .then((success) => {
          return resolve(success);
        }, (error) => {
          return reject(error);
        });
      });
    };

    return new Cli();
  };

  return function(argv) {
    let sahara = cli();
    if (Array.isArray(argv) && argv.length) {
      sahara.exec(argv)
      .then((success) => {
        if (success) {
          console.log(success);
        };
      }, (error) => {
        if (error) {
          console.log(chalk.red(error));
        };
      });
    } else {
      sahara.apiCall = true;
    }
    return sahara;
  };
})();
