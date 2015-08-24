/**
 * butterfly-loader
 *
 * @version @VERSION
 * @update @DATE
 */
;(function(global) {  // eslint-disable-line


var cache = {};
var EMPTY = [];


function require(id) {
    return cache[id];
}


function define(id, depends, o) {
    if (cache[id]) {
        throw 'module already exist: ' + id;
    }
    if (!o) {
        o = depends;
        depends = EMPTY;
    }
    if (typeof o === 'function') {
        var args = [];
        for (var i = 0, c = depends.length; i < c; i++) {
            args.push(require(depends[i]));
        }
        o = o.apply(null, args);
    }
    cache[id] = o;
}


define('origindefine', function() {
    return global.define;
});

define('global', function() {
    return global;
});


global.define = define;

// for test
define._cache = cache;


/*global window, global*/
})(typeof window === 'undefined' ? global : window);
