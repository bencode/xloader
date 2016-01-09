'use strict';


const klass = require('./klass');
const log = require('./log');

const listFields = { alias: true, resolve: true };


module.exports = klass({
  init: function() {
    this.cache = {};
  },


  get: function(name) {
    const cache = this.cache;
    return listFields[name] ? (cache[name] || []) : cache[name];
  },


  set: function(name, value) {
    log.debug('set config: ' + name, value);
    const cache = this.cache;
    if (listFields[name]) {
      cache[name] = cache[name] || [];
      cache[name].push(value);
    } else {
      cache[name] = value;
    }
  }
});
