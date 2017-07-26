'use strict';

let assert = require('assert');

describe('"prepare" method', function() {
  let sahara;
  let messages;

  before(function() {
    sahara = require('../../../index.js');
    messages = require('../../../src/sahara/sahara/message/messages');
  });

  it('Should provide a Promise.', function(done) {
    this.timeout(0);
    assert.doesNotThrow(function() {
      sahara.cli().prepare([]).then(function(success) {
        done();
      }, function(error) {
        done();
      });
    });
  });


});
