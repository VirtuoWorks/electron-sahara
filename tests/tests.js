'use strict';

let assert = require('assert');
let childProcess = require('child_process');

describe('Sahara', function() {
  describe('Sahara options.json map', function() {
    it('Should be required', function() {
      assert.doesNotThrow(function() {
        require('../src/sahara/sahara/options');
      });
    });
  });
  describe('Sahara messages.json map', function() {
    it('Should be required', function() {
      assert.doesNotThrow(function() {
        require('../src/sahara/sahara/messages');
      });
    });
  });
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
  it('Should be required for direct API use', function() {
    assert.doesNotThrow(function() {
      require('../index.js');
    });
  });
  it('Should provide an object when required for direct API use.', function() {
    assert.strictEqual(typeof require('../index.js'), 'object');
  });
  let cliCommands = ['create', 'start', 'help', 'info', 'requirements', 'prepare', 'compile', 'build', 'clean', 'run'];
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
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().create([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });
    it('Should be able to create a project with a valid directory name.', function(done) {
      this.timeout(0);
      let dir = 'MyApp';
      sahara.cli().create([dir, '-d']).then(function(success) {
        done();
      }, function(error) {
        if (error === messages.error.command.create) {
          done(new Error('Project was not created, Sahara reported an error.'));
        } else {
          done(new Error('Project was not created. Sahara did not report an error.'));
        }
      });
    });
    it('Should be able to create a project with a valid directory name and a valid template name.', function(done) {
      this.timeout(0);
      let dir = 'MyApp';
      let template = 'vanilla';
      sahara.cli().create([dir, template, '-d']).then(function(success) {
        done();
      }, function(error) {
        if (error === messages.error.command.create) {
          done(new Error('Project was not created, Sahara reported an error.'));
        } else {
          done(new Error('Project was not created. Sahara did not report an error.'));
        }
      });
    });
    it('Should not be able to create a project without a directory name.', function(done) {
      this.timeout(0);
      sahara.cli().create([]).then(function(success) {
        require('fs').readFile('./src/sahara/help/create', (error, data) => {
          if (error) {
            done(error);
          } else {
            if (data.toString() === success) {
              done();
            } else {
              done(new Error('Using "create" method without a directory name displays wrong help message.'));
            }
          }
        });
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done(new Error('Project was not created, but wrong message was returned.'));
        }
      });
    });
    it('Should not be able to create a project with an invalid directory name.', function(done) {
      this.timeout(0);
      let invalidDirName = (process.platform === 'mac') ? ':' : '/';
      sahara.cli().create([invalidDirName]).then(function(success) {
        done(new Error('Project created in invalid folder.'));
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done(new Error('Project was not created, but wrong message was returned.'));
        }
      });
    });
    it('Should not be able to create a project with a valid directory name and an invalid template name.', function(done) {
      this.timeout(0);
      let dir = '../MyApp';
      let invalidTemplate = 'unknown';
      sahara.cli().create([dir, invalidTemplate]).then(function(success) {
        done(new Error('Project created with unknown template.'));
      }, function(error) {
        if (error === messages.error.command.create) {
          done();
        } else {
          done(new Error('Project was not created, but wrong message was returned.'));
        }
      });
    });
  });

  describe('"start" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().start([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });

  describe('"help" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().help([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });

  describe('"info" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().info([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });

  describe('"requirements" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().requirements([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });

  describe('"prepare" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().compile([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });


  describe('"compile" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().compile([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });

  describe('"build" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().build([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });

  describe('"clean" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().clean([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });
  });

  describe('"run" method', function() {
    it('Should provide a Promise.', function(done) {
      this.timeout(0);
      assert.doesNotThrow(function() {
        sahara.cli().run([]).then(function(success) {
          done();
        }, function(error) {
          done();
        });
      });
    });

  });
});
