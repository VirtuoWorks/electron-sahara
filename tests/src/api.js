'use strict';

let assert = require('assert');

let apiMethods = [
  'exec',
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

it('Should be required to provide an API', function() {
  assert.doesNotThrow(function() {
    require('../../index.js');
  });
});

it('Should provide an object when required to provide an API.', function() {
  assert.strictEqual(typeof require('../../index.js'), 'object');
});

describe('API', function() {
  let sahara;
  beforeEach(function() {
    sahara = require('../../index.js');
  });

  apiMethods.forEach(function(method) {
    it(`Should provide a "${method}" method`, function() {
      assert.strictEqual(typeof sahara.cli()[method], 'function');
    });

    require(`./api/${method}.js`);
  });

  afterEach(function() {
    delete require.cache[require.resolve('../../index.js')];
  });
});
