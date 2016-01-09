'use strict';


const util = require('./util');
const Loader = require('./loader');


/* eslint no-underscore-dangle: 0 */


const butterfly = {};

butterfly.new = function(namespace, options) {
  return new Loader(namespace, options);
};


const gloader = butterfly('butterfly', { autoloadAnonymous: true });


const methods = [
  'config', 'on', 'off', 'define', 'require',
  'hasDefine', 'getModules', 'resolve', 'undefine'
];


util.each(methods, function(index, name) {
  butterfly[name] = gloader[name];
});


butterfly.define('global', function() {
  return global;
});


const originDefine = global.define;
const originButterfly = global.butterfly;

butterfly.noConflict = function(deep) {
  global.define = originDefine;
  if (deep) {
    global.butterfly = originButterfly;
  }
  return butterfly;
};


global.butterfly = butterfly;
global.define = butterfly.define;
