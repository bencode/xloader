'use strict';


/* eslint no-console: 0 */


const util = require('./util');


const LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };
const slice = [].slice;


const log = module.exports = {};


log.level = 'warn';
log.isEnabled = function(type) {
  return LEVEL[type] <= LEVEL[log.level];
};


util.each(LEVEL, function(type) {
  log[type] = function() {
    if (log.isEnabled(type)) {
      const args = slice.call(arguments, 0);
      args[0] = '[loader] ' + args[0];
      log.handler(type, args);
    }
  };
});


log.handler = typeof console !== 'undefined' ? function(type, args) {
  if (console[type]) {
    console[type].apply(console, args);
  }
} : function() {};
