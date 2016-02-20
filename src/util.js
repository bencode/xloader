'use strict';


const toString = Object.prototype.toString;
let guid = 1;


exports.isArray = Array.isArray ? Array.isArray :
function(o) {
  return toString.call(o) === '[object Array]';
};


exports.extend = function(des, src) {
  for (const k in src) {
    const v = src[k];
    if (v !== null && v !== undefined) {
      des[k] = v;
    }
  }
  return des;
};


exports.each = function(iter, fn) {
  const len = iter.length;
  const isArrayLike = len === 0 ||
      (typeof len === 'number' && len > 0 && (len - 1) in iter);

  if (isArrayLike) {
    for (let i = 0; i < len; i++) {
      fn(i, iter[i]);
    }
  } else {
    for (const k in iter) {
      fn(k, iter[k]);
    }
  }
};


exports.map = function(list, fn) {
  const ret = [];
  for (let i = 0, c = list.length; i < c; i++) {
    const v = fn(i, list[i]);
    v !== undefined && ret.push(v);
  }
  return ret;
};


exports.proxy = function(o, name) {
  const fn = o[name];
  return function() {
    return fn.apply(o, arguments);
  };
};


exports.assert = function(test, message) {
  if (!test) {
    throw new Error('AssertFailError: ' + message);
  }
};


exports.guid = function() {
  return guid++;
};


const rParent = /([-\w]+\/\.\.\/)/g;
const rCurrent = /([^.])\.\//g;

exports.join = function(parent, path) {
  path = parent + '/' + path;
  path = path.replace(rCurrent, '$1');
  while (rParent.test(path)) {
    path = path.replace(rParent, '');
  }
  return path;
};


const rLastSlash = /\/$/;
exports.dirname = function(path) {
  path = path.replace(rLastSlash, '');
  const pos = path.lastIndexOf('/');
  return pos === -1 ? '' : path.substr(0, pos);
};


exports.isBrowser = typeof window !== 'undefined' &&
    typeof document !== 'undefined';

