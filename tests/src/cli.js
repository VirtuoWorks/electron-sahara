'use strict';

let assert = require('assert');
let childProcess = require('child_process');

let cliCommands = [
  'help',
  'requirements',
  'create',
  'info',
  'start',
  'prepare',
  'compile',
  'build',
  'run',
  'clean'
];


it('Should be executed as a CLI', function(done) {
  this.timeout(0);
  childProcess.exec('node ./bin/sahara', function(error, stdout, stderr) {
    if (error) {
      done(error);
    } else {
      done();
    }
  });
});

describe('CLI', function() {
  it('Should not crash when no command is provided.', function(done) {
    this.timeout(0);
    childProcess.exec('node ./bin/sahara', function(error, stdout, stderr) {
      if (error) {
        done(error);
      } else {
        done();
      }
    });
  });

  it('Should provide help even for an unknown command.', function(done) {
    this.timeout(0);
    childProcess.exec('node ./bin/sahara help unknown', function(error, stdout, stderr) {
      if (error) {
        done(error);
      } else {
        done();
      }
    });
  });

  it('Should not crash when provided an unknown command.', function(done) {
    this.timeout(0);
    childProcess.exec('node ./bin/sahara unknown', function(error, stdout, stderr) {
      if (error) {
        done(error);
      } else {
        done();
      }
    });
  });

  cliCommands.forEach(function(command) {
    it(`Should provide a "${command}" command`, function(done) {
      this.timeout(0);
      childProcess.exec(`node ./bin/sahara ${command}`, function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });

    it(`Should provide help for "${command}" command`, function(done) {
      this.timeout(0);
      childProcess.exec(`node ./bin/sahara help ${command}`, function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });

    require(`./cli/${command}.js`);
  });
});