var assert = require('assert');
var childProcess = require('child_process');

describe('Sahara', function() {
  it('Should be required for direct API use', function() {
    assert.doesNotThrow(function() {
      var sahara = require('../index.js');
    });
  });
  it('Should provide an object when required for direct API use', function() {
    assert.strictEqual(typeof require('../index.js'), 'object');
  });
  it('Should be executed as a binary command', function(done) {
    childProcess.exec('node ./bin/sahara', function(error, stdout, stderr) {
      if (error) {
        done(error);
      } else {
        done();
      }
    });
  });
  var cliCommands = ['create', 'start', 'help', 'info', 'requirements', 'platform', 'prepare', 'compile', 'build', 'clean', 'run'];
  var apiMethods = ['exec'].concat(cliCommands);
  describe('API', function() {
    var sahara;
    beforeEach(function() {
      sahara = require('../index.js');
    });
    apiMethods.forEach(function(method) {
      it(`Should provide a "${method}" method`, function() {
        assert.strictEqual(typeof sahara.cli()[method], 'function');
      });
    });
    afterEach(function() {
      delete require.cache[require.resolve('../index.js')];
    });
  });
  describe('CLI', function() {
    cliCommands.forEach(function(command) {
      it(`Should provide a "${command}" command`, function(done) {
        childProcess.exec(`node ./bin/sahara ${command}`, function(error, stdout, stderr) {
          if (error) {
            done(error);
          } else {
            done();
          }
        });
      });
    });
    it('Should not crash when provided an unknown command', function(done) {
      childProcess.exec('node ./bin/sahara unknown', function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });
    it('Should not crash when no command is provided', function(done) {
      childProcess.exec('node ./bin/sahara', function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });
  });
});

describe('Sahara messages', function() {
  it('Should be required', function() {
    assert.doesNotThrow(function() {
      var messages = require('../src/messages/messages');
    });
  });
});

describe('Sahara API methods', function() {
  var sahara, messages;
  before(function() {
    sahara = require('../index.js');
    messages = require('../src/messages/messages');
  });
  describe('"create" method', function() {
    /*it('Should be able to create a new "Vanilla" project in "TestApp" folder', function(done) {
      this.timeout(0);
      sahara.cli().create(['TestApp']).then((success) {
        if (success === messages.done.command.create) {
          done();
        } else {
          done('New "Vanilla" project successfully created, but incorrect message was returned');
        }
      }, (error) {
        done('Unable to create new "Vanilla" project');
      });
    });*/
    it('Should not be able to create a project with an invalid directory name', function(done) {
      this.timeout(0);
      var invalidDirName = (process.platform === 'mac') ? ':' : '/';
      sahara.cli().create([invalidDirName]).then(function(success) {
        done('Project created in empty folder');
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done('Project was not created, but incorrect message was returned');
        }
      });
    });
/*
    it('Should not be able to create a project with missing argument', function(done) {
      this.timeout(0);
      sahara.cli().create([]).then((success) {
      }, (error) {
      });
    });*/
  });
/*
  describe('"help" method', function() {
    it('Should display programm help', function(done) {
      
    });
  });

  describe('"platform" method', function() {
    it('Should ...', function(done) {
      
    });
  });*/
});
