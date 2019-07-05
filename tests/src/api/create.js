'use strict';

const assert = require('assert');

describe('"create" method', function() {
  let sahara;
  let messages;

  before(function() {
    sahara = require('../../../index.js');
    messages = require('../../../src/sahara/sahara/message/messages');
  });

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
    const dir = 'MyApp';
    sahara.cli().create([dir, '-d']).then(function(success) {
      done();
    }, function(error) {
      if (error === messages.error.create.failure) {
        done(new Error('Project was not created, Sahara reported an error.'));
      } else {
        done(new Error('Project was not created. Sahara did not report an error.'));
      }
    });
  });

  it('Should be able to create a project with a valid directory name and a valid template name.', function(done) {
    this.timeout(0);
    const dir = 'MyApp';
    const template = 'vanilla';
    sahara.cli().create([dir, template, '-d']).then(function(success) {
      done();
    }, function(error) {
      if (error === messages.error.create.failure) {
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
      if (error === messages.error.create.failure) {
        done();
      } else {
        done(new Error('Project was not created, but wrong message was returned.'));
      }
    });
  });

  it('Should not be able to create a project with an invalid directory name.', function(done) {
    this.timeout(0);
    const invalidDirName = (process.platform === 'mac') ? ':' : '/';
    sahara.cli().create([invalidDirName]).then(function(success) {
      done(new Error('Project created in invalid folder.'));
    }, function(error) {
      if (error === messages.error.create.failure) {
        done();
      } else {
        done(new Error('Project was not created, but wrong message was returned.'));
      }
    });
  });

  it('Should not be able to create a project with a valid directory name and an invalid template name.', function(done) {
    this.timeout(0);
    const dir = 'MyApp';
    const invalidTemplate = 'unknown';
    sahara.cli().create([dir, invalidTemplate]).then(function(success) {
      done(new Error('Project created with unknown template.'));
    }, function(error) {
      if (error === messages.error.create.failure) {
        done();
      } else {
        done(new Error('Project was not created, but wrong message was returned.'));
      }
    });
  });
});
