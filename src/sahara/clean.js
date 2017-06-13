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
 * Expose `Clean` object.
 * @public
 */
const clean = module.exports = (function() {
  let Clean = function() {

  };

  Clean.prototype = command;

  return new Clean();
}());
