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
