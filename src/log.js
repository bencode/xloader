define('log', ['global', 'util'], function(global, util) {


var LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };

var level = (function() {
    var loc = global.location;
    var search = loc ? loc.search : '';
    return (/\bdebug-log-level=(\w+)/.exec(search) || {})[1] || global.debugLogLevel || 'error';
})();


var log = function(message, type) {
    if (log.isEnabled(type)) {
        message = '[loader] ' + message;
        log.handler(message, type);
    }
};


log.level = level;
log.isEnabled = function(type) {
    return LEVEL[type] <= LEVEL[log.level];
};


util.each(LEVEL, function(type) {
    log[type] = function(message) {
        log(message, type);
    };
});


var console = global.console;

log.handler = console ? function(msg, type) {
    if (console[type]) {
        console[type](msg);
    } else if (console.log) {
        console.log(msg);
    }
} : function() {};


return log;


});

