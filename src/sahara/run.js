/*!
 * Electron Sahara
 * @author sami.radi@virtuoworks.com (Sami Radi)
 * @company VirtuoWorks
 * @license MIT
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

// Electron Sahara modules.
const command = require('./sahara');
const messages = require('./sahara/messages');

/**
 * Expose `Run` object.
 * @public
 */
const run = module.exports = (function() {
  let Run = function() {

  };

  Run.prototype = command;

  return new Run();
}());
