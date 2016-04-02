'use strict';


/* eslint no-console: 0 */


const util = require('./util');


const LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };
const slice = [].slice;


const log = module.exports = {};


log.level = 'warn';
log.filter = false;

log.isEnabled = function(type) {
  return LEVEL[type] <= LEVEL[log.level];
};


util.each(LEVEL, function(type) {
  log[type] = function() {
    if (log.isEnabled(type)) {
      const args = slice.call(arguments, 0);
      if (!log.filter || log.filter(args[0])) {
        args[0] = '[loader] ' + args[0];
        log.handler(type, args);
      }
    }
  };
});


log.handler = typeof console !== 'undefined' ? function(type, args) {
  if (console[type]) {
    console[type].apply(console, args);
  }
} : function() {};


let filter = process.env.XLOADER_LOG;   // eslint-disable-line
if (process.browser) {
  const re = /\bxloader\.log=([^&]+)/;
  const match = re.exec(window.location.search); // eslint-disable-line
  filter = match && match[1];
}

if (filter) {
  log.level = 'debug';
  filter = filter
      .replace(/([.\[\]\(\)\{\}^$\\?+])/g, '\\$1')
      .replace(/\*/g, '.*');
  const rFilter = new RegExp('^' + filter + '$');
  log.filter = function(text) {
    return rFilter.test(text);
  };
}
