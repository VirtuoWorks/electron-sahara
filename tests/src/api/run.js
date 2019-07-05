'use strict';

let assert = require('assert');

describe('"run" method', function() {
  let sahara;
  let messages;

  before(function() {
    sahara = require('../../../index.js');
    messages = require('../../../src/sahara/sahara/message/messages');
  });

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

  it('Should be able to run a project build for current platform.', function(done) {
    this.timeout(0);
    sahara.cli().run(['-d']).then(function(success) {
      done();
    }, function(error) {
      if (error === messages.error.run.failure) {
        done(new Error('Project build was not run, Sahara reported an error.'));
      } else {
        done(new Error('Project build was not run. Sahara did not report an error.'));
      }
    });
  });
});