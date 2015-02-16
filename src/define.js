define('define', ['util', 'log'], function(util, log) {


var exports = function(loader) {
    var modules = loader.modules;

    this.define = function(id, depends, factory) {
        var module = regular(id, depends, factory);
        id = module.id;

        if (modules[id]) {
            log.warn('module already defined, ignore: ' + id);
            return modules[id];
        } else {
            log.debug('define module: ' + id);
            modules[id] = module;
        }

        loader.trigger('define', module);

        return module;
    };
};


/**
 * define(id, depends, factory)
 * define(id, factory{not array})
 * define(id, depends{array})
 * define(depends{array}, factory)
 * define(factory{function})
 */
var assert = util.assert;
var isArray = util.isArray;
var EMPTY = [];

function regular(id, depends, factory) {
    if (factory === undefined && !isArray(depends)) {
        factory = depends;
        depends = EMPTY;
    }

    if (typeof id === 'function') {
        factory = id;
        depends = EMPTY;
        id = null;
    } else if (isArray(id)) {
        depends = id;
        id = null;
    }

    assert(isArray(depends), 'arguments error, depends should be an array');

    var anonymous = !id;
    id = id || '____anonymous' + util.guid();

    return { id: id, depends: depends, factory: factory, anonymous: anonymous };
}
//~

return exports;


});
