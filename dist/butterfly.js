/**
 * butterfly-loader
 *
 * @version 2.4.5
 * @update 2015-08-24
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

define('util', function() {


var toString = Object.prototype.toString;
var guid = 1;


var exports = {

    isArray: Array.isArray ? Array.isArray : function(o) {
        return toString.call(o) === '[object Array]';
    },


    extend: function(des, src) {
        for (var k in src) {
            var v = src[k];
            if (v !== null && v !== undefined) {
                des[k] = v;
            }
        }
        return des;
    },


    each: function(iter, fn) {
        var len = iter.length;
        var isArrayLike = len === 0 ||
                (typeof len === 'number' && len > 0 && (len - 1) in iter);

        if (isArrayLike) {
            for (var i = 0; i < len; i++) {
                if (fn(i, iter[i]) === false) {
                    break;
                }
            }
        } else {
            for (var k in iter) {
                if (fn(k, iter[k]) === false) {
                    break;
                }
            }
        }
    },


    map: function(list, fn) {
        var ret = [];
        for (var i = 0, c = list.length; i < c; i++) {
            var v = fn(i, list[i]);
            v !== undefined && ret.push(v);
        }
        return ret;
    },


    proxy: function(o, name) {
        var fn = o[name];
        return function() {
            return fn.apply(o, arguments);
        };
    },


    assert: function(test, message) {
        if (!test) {
            throw new Error('AssertFailError: ' + message);
        }
    },


    guid: function() {
        return guid++;
    },


    when: function(works, fn) {
        var results = [];
        var n = works.length;
        var count = 0;

        var check = function() {
            count >= n && fn(results);
        };

        check();
        exports.each(works, function(index, work) {
            work(function(ret) {
                results[index] = ret;
                count++;
                check();
            });
        });
    }
};


return exports;


});

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


define('event', ['util', 'log'], function(util, log) {


var slice = [].slice;


return function(target) {
    var cache = {};

    target = target || {};

    target.on = function(name, fn) {
        log.debug('event.on:' + name);
        var list = cache[name] || (cache[name] = []);
        list.push(fn);
    };


    target.trigger = function(name) {
        log.debug('event.trigger:' + name);

        var list = cache[name];
        if (list) {
            var params = arguments.length > 1 ? slice.call(arguments, 1) : [];
            for (var i = 0, c = list.length; i < c; i++) {
                var result = list[i].apply(target, params);
                if (result !== null && result !== undefined) {
                    return result;
                }
            }
        }
    };


    target.off = function(name, fn) {
        log.debug('event.off:' + name);

        var list = cache[name];
        if (list) {
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i] === fn) {
                    list.splice(i, 1);
                }
            }
            if (!list.length) {
                delete cache[name];
            }
        }
    };


    return target;
};
//~


});

define('config', function() {

var listFields = { alias: true, resolve: true };

return function() {
    var cache = {};

    this.get = function(name) {
        return listFields[name] ? (cache[name] || []) : cache[name];
    };

    this.set = function(name, value) {
        if (listFields[name]) {
            cache[name] = cache[name] || [];
            cache[name].push(value);
        } else {
            cache[name] = value;
        }
    };
};
//~


});


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

/* jshint browser: true */
/* jshint maxstatements: 25 */

define('assets', ['log'], function(log) {


var rCss = /\.css(\?|$)/;

var exports = {};

exports.postLoadScript = null;


exports.load = function(url, options) {
    var type = rCss.test(url) ? 'css' : 'script';
    return exports[type](url, options);
};


var currentlyAddingScript;

exports.script = function(url, options) {
    log.debug('request script: ' + url);

    options = options || {};

    var node = doc.createElement('script');
    var removeNode = !log.isEnabled('debug');

    onLoadAssets(node, url, removeNode, options, function() {
        if (exports.postLoadScript) {
            exports.postLoadScript(url, options);
            exports.postLoadScript = null;
        }
    });

    node.async = 'async';
    if (options.namespace) {
        node.setAttribute('data-butterfly', options.namespace);
    }
    node.src = url;

    if (options.charset) {
        node.charset = options.charset;
    }

    currentlyAddingScript = node;
    append(node);
    currentlyAddingScript = null;
};
//~ script





var rWebKit = /.*webkit\/?(\d+)\..*/;
var rMobile = /mobile/;

var UA = window.navigator.userAgent.toLowerCase();
var webkitVersion = rWebKit.exec(UA);
var isOldWebKit = webkitVersion ? webkitVersion[1] * 1 < 536 : false;
var isPollCSS = isOldWebKit || (!webkitVersion && rMobile.test(UA));


exports.css = function(url, options) {
    log.debug('request css: ' + url);

    options = options || {};

    var node = doc.createElement('link');

    node.rel = 'stylesheet';
    node.href = url;

    if (options.charset) {
        node.charset = options.charset;
    }

    if (!('onload' in node) || isPollCSS) {
        setTimeout(function() {
            poll(node, options);
        }, 1);
    } else {
        onLoadAssets(node, url, false, options);
    }

    append(node);
};
//~ css


var rLoadSheetError = /security|denied/i;
function poll(node, options) {
    var flag = false;

    setTimeout(function() {
        if (!flag) {
            flag = true;
            options.error && options.error();
        }
    }, options.timeout || 10000);

    var fn = function() {
        var isLoaded = false;
        try {
            isLoaded = !!node.sheet;
        } catch (e) {
            isLoaded = rLoadSheetError.test(e.message);
        }

        if (!flag) {
            if (isLoaded) {
                flag = true;
                options.success && options.success();
            } else {
                setTimeout(fn, 20);
            }
        }
    };

    fn();
}


var rReadyStates = /loaded|complete|undefined/;
/* jshint maxparams:5 */
function onLoadAssets(node, url, removeNode, options, fn) {
    node.onload = node.onreadystatechange = function(event) {
        event = event || window.event || {};
        if (event.type === 'load' || rReadyStates.test('' + node.readyState)) {
            node.onload = node.onreadystatechange = node.onerror = null;
            removeNode && head.removeChild(node);
            log.debug('load success: ' + url);
            fn && fn();
            options.success && options.success();
        }
    };

    node.onerror = function() {
        node.onload = node.onreadystatechange = node.onerror = null;
        log.error('load error: ' + url);
        options.error && options.error();
    };
}


var doc = document;
var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
var baseElement = doc.getElementsByTagName('base')[0];

function append(node) {
    baseElement ? head.insertBefore(node, baseElement) :
            head.appendChild(node);
}


// from seajs
var interactiveScript;

exports.getCurrentScript = function() {
    if (currentlyAddingScript) {
        return currentlyAddingScript;
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === 'interactive') {
        return interactiveScript;
    }

    var scripts = head.getElementsByTagName('script');

    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.readyState === 'interactive') {
            interactiveScript = script;
            return interactiveScript;
        }
    }
};


return exports;


});

define('request', ['util', 'log', 'assets'], function(util, log, assets) {


var rFile = /\.(css|js)(\?.*)?$/;


return function(loader) {
    var modules = loader.modules;

    this.handle = function(options, callback) {
        var id = options.id;
        var url = options.url;

        var opts = loader.config('requestOptions');
        opts = typeof opts === 'function' ? opts(options) : opts;
        opts = util.extend({ id: id, namespace: options.namespace }, opts);

        opts.success = function() {
            // define a proxy module for just url request
            if (!modules[id] && rFile.test(id)) {
                log.debug('define proxy module for:' + id);
                loader.define(id);
                modules[id].file = true;
            }
            callback();
        };

        opts.error = function() {
            loader.trigger('requesterror', options);
        };

        assets.load(url, opts);
    };
};
//~


});

define('loader',
        ['global', 'util', 'log', 'event', 'config',
        'define', 'require', 'request'],

/* jshint maxparams:false */
function(global, util, log, Event, Config,
        Define, Require, Request) {

var exports = function(namespace, options) {
    var ns = namespace;
    var opt = options || {};

    if (global[ns]) {
        throw new Error('global.' + ns + ' already exist.');
    }

    global[ns] = this;

    this.namespace = ns;
    this.options = opt;

    init(this);
    handleAlias(this);
    handleResolve(this);
    handleRequest(this);
    defineSpecial(this);

    opt.autoloadAnonymous && loadAnonymous(this);
};


function init(self) {
    var modules = self.modules = {};

    new Event(self);

    var config = new Config();
    self.config = function(name, value) {
        return value === undefined ? config.get(name) :
                config.set(name, value);
    };

    self.define = util.proxy(new Define(self), 'define');
    self.require = util.proxy(new Require(self), 'require');

    self.hasDefine = function(id) {
        return !!modules[id];
    };

    self.getModules = function() {
        return modules;
    };

    self.resolve = function(id) {
        return self.trigger('resolve', id);
    };

    self.undefine = function(id) {
        delete modules[id];
    };
}


function handleAlias(self) {
    self.on('alias', function(id) {
        return filter(self.config('alias'), function(index, alias) {
            return typeof alias === 'function' ? alias(id) : alias[id];
        });
    });
}


var rAbs = /(^\w*:\/\/)|(^[.\/])/;

function handleResolve(self) {
    self.on('resolve', function(id) {
        var url = filter(self.config('resolve'), function(index, resolve) {
            return resolve(id);
        });

        if (!url && rAbs.test(id)) {
            url = id;
        }

        return url;
    });
}


function handleRequest(self) {
    var request = Request && (new Request(self));
    self.on('request', function(options, callback) {
        var handler = self.config('requestHandler');
        if (handler) {
            handler(options, callback);
        } else if (request) {
            request.handle(options, callback);
        } else {
            throw new Error('no request handler found');
        }
    });
}


function defineSpecial(self) {
    self.define('require', function() {
        return self.require;
    });

    self.define('module', function() {
        return {
            $compile: function(module) {
                return module;
            }
        };
    });

    self.define('exports', function() {
        return {
            $compile: function(module) {
                return module.exports;
            }
        };
    });
}


function loadAnonymous(self) {
    self.on('define', function(module) {
        if (module.anonymous) {
            log.debug('require anonymous module: ' + module.id);
            self.require(module.id);
        }
    });
}


function filter(list, fn) {
    if (!list || list.length === 0) {
        return;
    }
    for (var i = 0, c = list.length; i < c; i++) {
        var v = fn(i, list[i]);
        if (v) {
            return v;
        }
    }
}


return exports;


});

define('weave', ['global', 'origindefine', 'util', 'loader'],
        function(global, origindefine, util, Loader) {

var butterfly = function(namespace, options) {
    var o = new Loader(namespace, options);
    butterfly._modules[namespace] = o.modules;
    return o;
};


// save loader define
var _define = define;


// for test and debug
butterfly._define = _define;
butterfly._modules = {};

// for plugin
butterfly.plugin = function(name, depends, factory) {
    _define('plugin/' + name, depends, factory);
};


var loader = butterfly('butterfly', { autoloadAnonymous: true });


var methods = ['config', 'on', 'off', 'define', 'require',
        'hasDefine', 'getModules', 'resolve', 'undefine'];

util.each(methods, function(index, name) {
    butterfly[name] = loader[name];
});


butterfly.define('global', function() {
    return global;
});


var _butterfly = global.butterfly;

global.butterfly = butterfly;
global.define = butterfly.define;

butterfly.noConflict = function() {
    global.define = origindefine;
    global.butterfly = _butterfly;
    return butterfly;
};


});
