'use strict';


/* eslint no-console: 0 */


const util = require('./util');


const LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };


module.exports = log;


const slice = [].slice;

function log(type, args) {
  if (log.isEnabled(type)) {
    args = slice.call(args, 0);
    args[0] = '[loader] ' + args[0];
    log.handler(type, args);
  }
}


log.level = 'warn';
log.isEnabled = function(type) {
  return LEVEL[type] <= LEVEL[log.level];
};



util.each(LEVEL, function(type) {
  log[type] = function() {
    log(type, arguments);
  };
});


log.handler = typeof console !== 'undefined' ? function(type, args) {
  if (console[type]) {
    console[type].apply(console, args);
  }
} : function() {};
