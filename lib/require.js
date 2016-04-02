'use strict';


const klass = require('./klass');
const util = require('./util');
const log = require('./log');


const assert = util.assert;


module.exports = klass({
  init: function(loader) {
    this.loader = loader;
    this.aliasCache = {};
  },


  require: function(depends, callback) {
    depends = util.isArray(depends) ? depends : [depends];

    const module = {
      proxy: true,
      id: '____require' + util.guid(),
      depends: depends,
      factory: function() {
        return arguments;
      }
    };

    load(this, module, function() {
      callback && callback.apply(null, module.exports);
    });

    return module.exports && module.exports[0];
  }
});



function load(self, module, callback) {
  log.debug('init module: ' + module.id);

  if (module.loadtimes > 0) {
    module.loadtimes++;
    log.debug(module.id + ' is loaded', module.exports);
    callback();
    return;
  }

  const loadlist = module.loadlist || (module.loadlist = []);
  loadlist.push(callback);
  if (loadlist.length > 1) {
    log.debug('module is in loading: ' + module.id);
    return;
  }

  loadDepends(self, module, function() {
    compile(self, module, function() {
      log.debug(module.id + ' is loaded', module.exports);
      module.loadtimes = loadlist.length;
      delete module.loadlist;
      util.each(loadlist, function(index, fn) {
        fn();
      });
    });
  });
}
//~ load


const rRelative = /^\.\.?\//;


function loadDepends(self, module, callback) {
  const loader = self.loader;
  const modules = loader.modules;

  const depends = module.depends;
  if (depends.length === 0) {
    return callback();
  }

  const adepends = module.adepends = [];
  const rpath = util.dirname(module.id);
  util.each(depends, function(index, id) {
    adepends[index] = rRelative.test(id) ? util.join(rpath, id) : id;
  });


  log.debug('try load depends for: ' + module.id, adepends);

  // 并行加载依赖模块
  const n = adepends.length;
  let count = 0;

  const aliasCache = self.aliasCache;

  util.each(adepends, function(index, id) {
    const aid = aliasCache[id] || loader.trigger('alias', id);
    if (aid && id !== aid) {
      log.debug('alias ' + id + ' -> ' + aid);
      id = aid;
      aliasCache[id] = id;
      adepends[index] = id;
    }

    let called = false;
    const cb = function() {
      // istanbul ignore if
      if (called) {
        log.error('depend already loaded: ' + id);
        return;
      }
      called = true;
      count++;
      count >= n && callback();
    };

    // 依赖的模块不需要异步加载
    const o = modules[id];
    if (o) {
      load(self, o, cb);
      return;
    }

    // 依赖的模块是异步加载
    loadAsync(self, id, function(lo) {
      load(self, lo, cb);
    }, function(reason) {
      const e = new Error('load dependency error, ' +
                    module.id + ' -> ' + id + ', reason: ' + reason);
      loader.trigger('error', e);
    });
  });
}
//~ loadDepends


function compile(self, module, callback) {
  const loader = self.loader;
  const modules = loader.modules;

  loader.trigger('compile', module);

  let factory = module.factory;
  if (typeof factory === 'function') {
    const depends = module.adepends;
    const proxy = { id: module.id, exports: {} };
    const list = [];

    depends && depends.length &&
    util.each(depends, function(index, id) {
      const o = modules[id];
      assert((o && ('exports' in o)), 'module should already loaded: ' + id);
      if (o.exports && typeof o.exports.$compile === 'function') {
        list[index] = o.exports.$compile(proxy, module);
      } else {
        list[index] = o.exports;
      }
    });

    try {
      log.debug('compile ' + module.id, module);
      factory = factory.apply(null, list);
      if (factory === undefined) {
        factory = proxy.exports;
      }
    } catch (e) {
      factory = null;
      loader.trigger('error', e);
    }
  }

  module.exports = factory;
  callback();
}
//~ compile


const requestList = {};

function loadAsync(self, id, callback, error) {
  const loader = self.loader;
  const modules = loader.modules;

  const url = loader.trigger('resolve', id);
  if (!url) {
    error('can not resolve module: ' + id);
    return;
  }

  log.debug('resolve ' + id + ' -> ' + url);

  const list = requestList[id] || (requestList[id] = []);

  const cb = function() {
    const o = modules[id];
    if (!o) {
      error('can not find module: ' + id);
      return;
    }

    o.async = true;
    o.url = url;
    callback(o);
  };

  list.push(cb);
  if (list.length > 1) {
    return;
  }

  const options = {
    id: id,
    url: url,
    namespace: loader.namespace
  };

  log.debug('try request: ' + url);
  loader.trigger('request', options, function() {
    delete requestList[id];
    util.each(list, function(index, fn) {
      fn();
    });
  });
}
//~ loadAsync
