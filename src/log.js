'use strict';


/* eslint no-console: 0 */


const util = require('./util');


const LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };


/* eslint complexity: [2, 10] */
const level = (function() {
  const loc = global.location || {};
  const env = (global.process || {}).env || {};
  const search = loc.search || '';
  const match = (/\bdebug-log-level=(\w+)/).exec(search);
  return match && match[1] ||
      global.debugLogLevel || env.DEBUG_LOG_LEVEL || 'error';
})();


module.exports = log;


const slice = [].slice;

function log(type, args) {
  if (log.isEnabled(type)) {
    args = slice.call(args, 0);
    args[0] = '[loader] ' + args[0];
    log.handler(type, args);
  }
}


log.level = level;
log.isEnabled = function(type) {
  return LEVEL[type] <= LEVEL[log.level];
};



util.each(LEVEL, function(type) {
  log[type] = function() {
    log(type, arguments);
  };
});


const console = global.console;

log.handler = console ? function(type, args) {
  if (console[type]) {
    console[type].apply(console, args);
  }
} : function() {};
