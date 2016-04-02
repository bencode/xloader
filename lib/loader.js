'use strict';


const util = require('./util');
const log = require('./log');
const klass = require('./klass');
const Event = require('./event');
const Config = require('./config');
const Define = require('./define');
const Require = require('./require');
const Request = require('./request');


module.exports = klass({
  init: function(namespace, options) {
    const ns = namespace;
    const opt = options || {};

    this.namespace = ns;
    this.options = opt;

    init(this);
    handleError(this);
    handleAlias(this);
    handleResolve(this);
    handleRequest(this);
    defineSpecial(this);

    opt.autoloadAnonymous && loadAnonymous(this);
  }
});


function init(self) {
  const modules = self.modules = {};

  new Event(self);    // eslint-disable-line

  const config = new Config();
  const define = new Define(self);
  const require = new Require(self);

  if (log.isEnabled('debug')) {
    self._config = config;
    self._define = define;
    self._require = require;
  }

  self.config = function(name, value) {
    if (typeof name === 'object') {
      for (const key in name) {
        config.set(key, name[key]);
      }
      return;
    }

    return value === undefined ? config.get(name) :
        config.set(name, value);
  };

  self.define = util.proxy(define, 'define');
  self.require = util.proxy(require, 'require');

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


function handleError(self) {
  self.on('error', function(e) {
    log.error(e.stack);
  });
}


function handleAlias(self) {
  self.on('alias', function(id) {
    return filter(self.config('alias'), function(index, alias) {
      return typeof alias === 'function' ? alias(id) : alias[id];
    });
  });
}


const rAbs = /(^(\w+:)?\/\/)|(^\/)/;

function handleResolve(self) {
  self.on('resolve', function(id) {
    let url = filter(self.config('resolve'), function(index, resolve) {
      return resolve(id);
    });

    if (!url && rAbs.test(id)) {
      url = id;
    }

    return url;
  });
}


function handleRequest(self) {
  const request = new Request(self);
  self.on('request', function(options, callback) {
    request.handle(options, callback);
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
    return null;
  }
  for (let i = 0, c = list.length; i < c; i++) {
    const v = fn(i, list[i]);
    if (v) {
      return v;
    }
  }
}
