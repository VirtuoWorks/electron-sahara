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
 * Expose `Requirements` object.
 * @public
 */
const requirements = module.exports = (function() {
  let Requirements = function() {

  };

  Requirements.prototype = command;

  return new Requirements();
}());
