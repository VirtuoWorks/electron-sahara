/*
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
const message = require('./sahara/message');

/**
 * Expose `Info` object.
 * @public
 */
module.exports = (function() {
  const Info = function() {

  };

  Info.prototype = command;
  Info.prototype.constructor = Info;

  return new Info();
}());
