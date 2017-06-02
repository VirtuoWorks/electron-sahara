'use strict';

let assert = require('assert');
let childProcess = require('child_process');

describe('Sahara', function() {
  describe('Sahara messages.json map', function() {
    it('Should be required', function() {
      assert.doesNotThrow(function() {
        require('../src/sahara/sahara/messages');
      });
    });
  });
  describe('Sahara options.json map', function() {
    it('Should be required', function() {
      assert.doesNotThrow(function() {
        require('../src/sahara/sahara/options');
      });
    });
  });
  it('Should be executed as a CLI', function(done) {
    childProcess.exec('node ./bin/sahara', function(error, stdout, stderr) {
      if (error) {
        done(error);
      } else {
        done();
      }
    });
  });
  it('Should be required for direct API use', function() {
    assert.doesNotThrow(function() {
      require('../index.js');
    });
  });
  it('Should provide an object when required for direct API use', function() {
    assert.strictEqual(typeof require('../index.js'), 'object');
  });
  let cliCommands = ['create', 'start', 'help', 'info', 'requirements', 'platform', 'prepare', 'compile', 'build', 'clean', 'run'];
  let apiMethods = ['exec'].concat(cliCommands);
  describe('API', function() {
    let sahara;
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
    });
    it('Should not crash when no command is provided', function(done) {
      this.timeout(0);
      childProcess.exec('node ./bin/sahara', function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });
    it('Should not crash when provided an unknown command', function(done) {
      this.timeout(0);
      childProcess.exec('node ./bin/sahara unknown', function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });
    it('Should provide help for an unknown command', function(done) {
      this.timeout(0);
      childProcess.exec(`node ./bin/sahara help unknown`, function(error, stdout, stderr) {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    });
  });
});

describe('Sahara API', function() {
  let sahara;
  let messages;
  before(function() {
    sahara = require('../index.js');
    messages = require('../src/sahara/sahara/messages');
  });
  describe('"create" method', function() {
    it('Should be able to create a project with a valid directory name', function(done) {
      this.timeout(0);
      let dir = 'MyApp';
      sahara.cli().create([dir]).then(function(success) {
        done();
      }, function(error) {
        if (error === messages.error.command.create) {
          done('Project was not created, but Sahara reported an error.');
        } else {
          done('Project was not created. Sahara crashed.');
        }
      });
    });
    it('Should be able to create a project with a valid directory name and a valid template name', function(done) {
      this.timeout(0);
      let dir = 'MyApp';
      let template = 'vanilla';
      sahara.cli().create([dir, template]).then(function(success) {
        done();
      }, function(error) {
        if (error === messages.error.command.create) {
          done('Project was not created, but Sahara reported an error.');
        } else {
          done('Project was not created. Sahara crashed.');
        }
      });
    });
    it('Should not be able to create a project without a directory name', function(done) {
      this.timeout(0);
      sahara.cli().create([]).then(function(success) {
        done('Project created in empty folder.');
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done('Project was not created, but wrong message was returned.');
        }
      });
    });
    it('Should not be able to create a project with an invalid directory name', function(done) {
      this.timeout(0);
      let invalidDirName = (process.platform === 'mac') ? ':' : '/';
      sahara.cli().create([invalidDirName]).then(function(success) {
        done('Project created in invalid folder.');
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done('Project was not created, but wrong message was returned.');
        }
      });
    });
    it('Should not be able to create a project with a valid directory name and an invalid template name', function(done) {
      this.timeout(0);
      let dir = 'MyApp';
      let invalidTemplate = 'unknown';
      sahara.cli().create([dir, invalidTemplate]).then(function(success) {
        done('Project created with unknown template.');
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done('Project was not created, but wrong message was returned.');
        }
      });
    });
  });
});
