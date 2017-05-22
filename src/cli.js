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
    };

    Cli.prototype.exec = function(argv) {
      if (Array.isArray(argv) && argv.length > 2) {
        console.log(chalk.gray(messages.info.exec));

        this.argv = argv || process.argv;

        if (this[this.argv[2]]) {
          this.command = this.argv[2];
          this.args = this.argv.slice(3,this.argv.length) || [];
          if (this.args.length) {
              if (fs.existsSync(`${__dirname}/sahara/${this.command}.js`)) {
                console.log(chalk.gray(messages.info.command[this.command]));
                require(`./sahara/${this.command}.js`).exec(this.args).then((success) => {
                  console.log(chalk.green(success));
                }, (error) => {
                  console.log(chalk.red(error));
                });
              } else {
                require('./sahara/help').exec(argv).then((success) => {
                  console.log(chalk.green(success));
                }, (error) => {
                  console.log(chalk.red(error));
                });
              }
          } else {
            console.log(chalk.red(messages.error.argument.missing));
            require('./sahara/help').exec(this.args).then((success) => {
              console.log(chalk.green(success));
            }, (error) => {
              console.log(chalk.red(error));
            });
          }
        } else {
          console.log(chalk.red(messages.error.command.notFound));
          require('./sahara/help').exec(argv).then((success) => {
            console.log(chalk.green());
          }, (error) => {
            console.log(chalk.red(error));
          });
        };
      } else {
        require('./sahara/help').exec(argv).then((success) => {
          console.log(chalk.green());
        }, (error) => {
          console.log(chalk.red(error));
        });
      };
      return this;
    };

    // sahara create <command>
    // Create a project
    Cli.prototype.create = function(args){
      this.exec(['','','create'].concat(args));
      return this;
    };

    // sahara start <command>
    // Start your project
    Cli.prototype.start = function(args){
      this.exec(['','','start'].concat(args));
      return this;
    };

    // sahara help <command>
    // Get help for a command
    Cli.prototype.help = function(args){
      this.exec(['','','help'].concat(args));
      return this;
    };

    // sahara info <command>
    // Generate project information
    Cli.prototype.info = function(args){
      this.exec(['','','info'].concat(args));
      return this;
    };
 
    // sahara requirements <command>
    // Checks and print out all the requirements for specified platforms 
    Cli.prototype.requirements = function(args){
      this.exec(['','','requirements'].concat(args));
      return this;
    };
 
    // sahara platform <command>
    // Manage project platforms
    Cli.prototype.platform = function(args){
      this.exec(['','','platform'].concat(args));
      return this;
    };

    // sahara prepare <command>
    // Copy files into platform(s) for building
    Cli.prototype.prepare = function(args){
      this.exec(['','','prepare'].concat(args));
      return this;
    };

    // sahara compile <command>
    // Build platform(s)
    Cli.prototype.compile = function(args){
      this.exec(['','','compile'].concat(args));
      return this;
    };

    // sahara prepare && sahara compile
    Cli.prototype.build = function(args){
      this.exec(['','','build'].concat(args));
      return this;
    };

    // sahara clean <command>
    // Cleanup project from build artifacts
    Cli.prototype.clean = function(args){
      this.exec(['','','clean'].concat(args));
      return this;
    };

    // sahara run <command>
    // Run project (including prepare && compile)
    Cli.prototype.run = function(args){
      this.exec(['','','run'].concat(args));
      return this;
    };

    return new Cli();
  };

  return function(argv) {
    return cli().exec(argv);
  };
})();