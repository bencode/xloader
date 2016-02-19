'use strict';


const util = require('./util');
const Loader = require('./loader');


/* eslint no-underscore-dangle: 0 */


const loader = module.exports = {};

loader.new = function(namespace, options) {
  return new Loader(namespace, options);
};


const x = loader.new('x', { autoloadAnonymous: true });


const methods = [
  'config', 'on', 'off', 'define', 'require',
  'hasDefine', 'getModules', 'resolve', 'undefine'
];


util.each(methods, function(index, name) {
  loader[name] = x[name];
});


x.define('global', function() {
  return global;
});


if (util.isBrowser) {
  const originDefine = global.define;
  const originRequire = global.require;
  const originLoader = global.xloader;

  loader.noConflict = function(deep) {
    global.define = originDefine;
    global.require = originRequire;
    if (deep) {
      global.xloader = originLoader;
    }
    return loader;
  };

  global.xloader = loader;
  global.define = loader.define;
  global.require = loader.require;
}
