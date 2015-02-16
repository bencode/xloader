define('require', ['util', 'log'], function(util, log) {


var assert = util.assert;


return function(loader) {


var modules = loader.modules;


this.require = function(depends, callback) {
    depends = util.isArray(depends) ? depends : [depends];

    var module = {
        proxy: true,
        id: '____require' + util.guid(),
        depends: depends,
        factory: function() {
            return arguments;
        }
    };

    load(module, function() {
        callback && callback.apply(null, module.exports);
    });

    return module.exports && module.exports[0];
};
//~ require


function load(module, callback) {
    if (module.loadtimes > 0) {
        module.loadtimes++;
        log.debug(module.id + ' is loaded ' + module.loadtimes + ' times');
        callback();
        return;
    }

    var loadlist = module.loadlist || (module.loadlist = []);
    loadlist.push(callback);
    if (loadlist.length > 1) {
        return;
    }

    loadDepends(module, function() {
        compile(module, function() {
            log.debug(module.id + ' is loaded');
            module.loadtimes = loadlist.length;
            delete module.loadlist;
            util.each(loadlist, function(index, fn) {
                fn();
            });
        });
    });
}
//~ load


var aliasCache = {};

function loadDepends(module, callback) {
    var depends = module.depends;
    if (depends.length === 0) {
        return callback();
    }

    var adepends = module.adepends = depends.slice(0);

    var works = util.map(depends, function(index, id) {
        return function(fn) {
            var aid = aliasCache[id] || loader.trigger('alias', id);
            if (aid) {
                log.debug('alias ' + id + ' -> ' + aid);
                id = aid;
            }
            aliasCache[id] = id;
            adepends[index] = id;

            var o = modules[id];
            var lfn = function(o) {
                load(o, fn);
            };

            o ? lfn(o) : loadAsync(id, lfn);
        };
    });

    util.when(works, callback);
}
//~ loadDepends


function compile(module, callback) {
    loader.trigger('compile', module);
    var factory = module.factory;
    if (typeof factory === 'function') {
        var depends = module.adepends;
        var proxy = { id: module.id, exports: {} };
        var list = [];

        depends && depends.length &&
        util.each(depends, function(index, id) {
            var o = modules[id];
            assert((o && ('exports' in o)), 'module should already loaded: ' + id);
            if (o.exports && typeof o.exports.$compile === 'function') {
                list[index] = o.exports.$compile(proxy, module);
            } else {
                list[index] = o.exports;
            }
        });

        try {
            log.debug('compile ' + module.id);
            factory = factory.apply(null, list);
            if (factory === undefined) {
                factory = proxy.exports;
            }
        } catch (e) {
            log.error(e.stack);
            loader.trigger('error', e);
            if (log.isEnabled('info')) {
                throw e;
            }
        }
    }

    module.exports = factory;
    callback();
}
//~ compile


var requestList = {};

function loadAsync(id, fn) {
    var list = requestList[id] || (requestList[id] = []);

    var cb = function(url) {
        var o = modules[id];
        if (!o) {
            log.error('can not find module: ' + loader.namespace + ':' + id);
            return;
        }
        o.async = true;
        o.url = url;
        fn(o);
    };

    list.push(cb);
    if (list.length > 1) {
        return;
    }

    var url = loader.trigger('resolve', id);
    if (!url) {
        log.error('can not resolve module: ' + loader.namespace + ':' + id);
        return;
    }

    log.debug('resolve ' + id + ' -> ' + url);

    var options = {
        id: id,
        url: url,
        namespace: loader.namespace
    };

    loader.trigger('request', options, function() {
        delete requestList[id];
        util.each(list, function(index, fn) {
            fn(url);
        });
    });
}
//~ loadAsync


};
//~ exports;


});
