'use strict';


const log = require('./log');


const slice = [].slice;


module.exports = function(target) {
  const cache = {};

  target = target || {};

  target.on = function(name, fn) {
    log.debug('event.on: ' + name, fn);
    const list = cache[name] || (cache[name] = []);
    list.push(fn);
  };


  target.trigger = function(name) {
    const list = cache[name];
    if (list) {
      const params = arguments.length > 1 ? slice.call(arguments, 1) : [];
      log.debug('event.trigger: ' + name, params);
      for (let i = 0, c = list.length; i < c; i++) {
        const result = list[i].apply(target, params);
        if (result !== null && result !== undefined) {
          return result;
        }
      }
    }
  };


  target.off = function(name, fn) {
    log.debug('event.off: ' + name, fn);

    const list = cache[name];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
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
