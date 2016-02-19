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


exports.when = function(works, fn) {
  const results = [];
  const n = works.length;
  let count = 0;

  const check = function() {
    count >= n && fn(results);
  };

  check();
  exports.each(works, function(index, work) {
    let flag = false;
    work(function(ret) {
      if (flag) {
        return;
      }
      flag = true;
      results[index] = ret;
      count++;
      check();
    });
  });
};


exports.isBrowser = typeof window !== 'undefined' &&
    typeof document !== 'undefined';

