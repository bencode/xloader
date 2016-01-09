'use strict';


const util = require('./util');
const log = require('./log');
const klass = require('./klass');


module.exports = klass({
  init: function(loader) {
    this.loader = loader;
  },


  define: function(id, depends, factory) {
    const loader = this.loader;
    const modules = loader.modules;

    const module = regular(id, depends, factory);
    id = module.id;

    if (modules[id]) {
      log.warn('module already defined, ignore: ' + id);
      return modules[id];
    }

    log.debug('define module: ' + id, module);
    modules[id] = module;

    loader.trigger('define', module);

    return module;
  }
});



/**
 * define(id, depends, factory)
 * define(id, factory{not array})
 * define(id, depends{array})
 * define(depends{array}, factory)
 * define(factory{function})
 */
const assert = util.assert;
const isArray = util.isArray;
const EMPTY = [];

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

  const anonymous = !id;
  id = id || '____anonymous' + util.guid();

  return { id: id, depends: depends, factory: factory, anonymous: anonymous };
}
