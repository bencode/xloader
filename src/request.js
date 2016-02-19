'use strict';


const klass = require('./klass');
const util = require('./util');
const log = require('./log');


const rFile = /\.\w+(\?|$)/;


module.exports = klass({
  init: function(loader) {
    this.loader = loader;
  },


  handle: function(options, callback) {
    const loader = this.loader;
    const handler = loader.config('requestHandler');
    if (handler) {
      return handler(options, callback);
    }

    if (!util.isBrowser) {
      throw new Error('requestHandler not exists');
    }

    const modules = loader.modules;
    const id = options.id;
    const url = options.url;

    let opts = loader.config('requestOptions');
    opts = typeof opts === 'function' ? opts(options) : opts;
    opts = util.extend({ id: id, namespace: options.namespace }, opts);

    opts.success = function() {
      log.debug('request assets success: ' + url, options);
      // define a proxy module for just url request
      if (!modules[id] && rFile.test(id)) {
        loader.define(id);
        modules[id].file = true;
      }
      callback();
    };

    opts.error = function(e) {
      log.debug('request assets error: ' + url, e);
      loader.trigger('error', e, options);
    };

    log.debug('request assets: ' + url, options);
    const assets = require('./assets');
    assets.load(url, opts);
  }
});
