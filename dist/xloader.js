var xloader =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var util = __webpack_require__(2);
	var log = __webpack_require__(6);
	var Loader = __webpack_require__(19);

	/* eslint no-underscore-dangle: 0 */

	var loader = module.exports = {};

	loader.new = function (namespace, options) {
	  return new Loader(namespace, options);
	};

	loader.log = log;

	var x = loader.new('x', { autoloadAnonymous: true });

	var methods = ['config', 'on', 'off', 'define', 'require', 'hasDefine', 'getModules', 'resolve', 'undefine'];

	util.each(methods, function (index, name) {
	  loader[name] = x[name];
	});

	x.define('global', function () {
	  return global;
	});

	if (process.browser) {
	  (function () {
	    var originDefine = global.define;
	    var originRequire = global.require;
	    var originLoader = global.xloader;

	    loader.noConflict = function (deep) {
	      global.define = originDefine;
	      global.require = originRequire;
	      if (deep) {
	        global.xloader = originLoader;
	      }
	      return loader;
	    };

	    loader.assets = __webpack_require__(17);

	    global.xloader = loader;
	    global.define = loader.define;
	    global.require = loader.require;
	  })();
	}

	var isDebug = process.browser ? /\bdebug-xloader\b/.test(window.location.search) : // eslint-disable-line
	process.env.DEBUG === 'xloader'; // eslint-disable-line

	if (isDebug) {
	  log.level = 'debug';
		}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString;
	var guid = 1;

	exports.isArray = Array.isArray ? Array.isArray : isArray;

	exports.__test = {
	  isArray: isArray
	};

	function isArray(o) {
	  return toString.call(o) === '[object Array]';
	}

	exports.extend = function (des, src) {
	  for (var k in src) {
	    var v = src[k];
	    if (v !== null && v !== undefined) {
	      des[k] = v;
	    }
	  }
	  return des;
	};

	exports.each = function (iter, fn) {
	  var len = iter.length;
	  var isArrayLike = len === 0 || typeof len === 'number' && len > 0 && len - 1 in iter;

	  if (isArrayLike) {
	    for (var i = 0; i < len; i++) {
	      fn(i, iter[i]);
	    }
	  } else {
	    for (var k in iter) {
	      fn(k, iter[k]);
	    }
	  }
	};

	exports.map = function (list, fn) {
	  var ret = [];
	  for (var i = 0, c = list.length; i < c; i++) {
	    var v = fn(i, list[i]);
	    v !== undefined && ret.push(v);
	  }
	  return ret;
	};

	exports.proxy = function (o, name) {
	  var fn = o[name];
	  return function () {
	    return fn.apply(o, arguments);
	  };
	};

	exports.assert = function (test, message) {
	  if (!test) {
	    throw new Error('AssertFailError: ' + message);
	  }
	};

	exports.guid = function () {
	  return guid++;
	};

	var rParent = /([-\w]+\/\.\.\/)/g;
	var rCurrent = /([^.])\.\//g;

	exports.join = function (parent, path) {
	  path = parent + '/' + path;
	  path = path.replace(rCurrent, '$1');
	  while (rParent.test(path)) {
	    path = path.replace(rParent, '');
	  }
	  return path;
	};

	var rLastSlash = /\/$/;
	exports.dirname = function (path) {
	  path = path.replace(rLastSlash, '');
	  var pos = path.lastIndexOf('/');
	  return pos === -1 ? '' : path.substr(0, pos);
		};

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* eslint no-console: 0 */

	var util = __webpack_require__(2);

	var LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };
	var slice = [].slice;

	var log = module.exports = {};

	log.level = 'warn';
	log.isEnabled = function (type) {
	  return LEVEL[type] <= LEVEL[log.level];
	};

	util.each(LEVEL, function (type) {
	  log[type] = function () {
	    if (log.isEnabled(type)) {
	      var args = slice.call(arguments, 0);
	      args[0] = '[loader] ' + args[0];
	      log.handler(type, args);
	    }
	  };
	});

	log.handler = typeof console !== 'undefined' ? function (type, args) {
	  if (console[type]) {
	    console[type].apply(console, args);
	  }
		} : function () {};

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var log = __webpack_require__(6);

	var slice = [].slice;

	module.exports = function (target) {
	  var cache = {};

	  target = target || {};

	  target.on = function (name, fn) {
	    log.debug('event.on: ' + name, fn);
	    var list = cache[name] || (cache[name] = []);
	    list.push(fn);
	  };

	  target.trigger = function (name) {
	    var list = cache[name];
	    if (list) {
	      var params = arguments.length > 1 ? slice.call(arguments, 1) : [];
	      log.debug('event.trigger: ' + name, params);
	      for (var i = 0, c = list.length; i < c; i++) {
	        var result = list[i].apply(target, params);
	        if (result !== null && result !== undefined) {
	          return result;
	        }
	      }
	    }
	  };

	  target.off = function (name, fn) {
	    log.debug('event.off: ' + name, fn);

	    var list = cache[name];
	    if (list) {
	      for (var i = list.length - 1; i >= 0; i--) {
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

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var klass = __webpack_require__(11);
	var log = __webpack_require__(6);

	var listFields = { alias: true, resolve: true };

	module.exports = klass({
	  init: function init() {
	    this.cache = {};
	  },

	  get: function get(name) {
	    var cache = this.cache;
	    return listFields[name] ? cache[name] || [] : cache[name];
	  },

	  set: function set(name, value) {
	    log.debug('set config: ' + name, value);
	    var cache = this.cache;
	    if (listFields[name]) {
	      cache[name] = cache[name] || [];
	      cache[name].push(value);
	    } else {
	      cache[name] = value;
	    }
	  }
		});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(2);

	module.exports = function (proto) {
	  var klass = function klass() {
	    var init = this.init;
	    return init && init.apply(this, arguments);
	  };

	  proto && util.extend(klass.prototype, proto);

	  return klass;
		};

/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(2);
	var log = __webpack_require__(6);
	var klass = __webpack_require__(11);

	module.exports = klass({
	  init: function init(loader) {
	    this.loader = loader;
	  },

	  define: function define(id, depends, factory) {
	    var loader = this.loader;
	    var modules = loader.modules;

	    var module = regular(id, depends, factory);
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
	var assert = util.assert;
	var isArray = util.isArray;
	var EMPTY = [];

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

	  var anonymous = !id;
	  id = id || '____anonymous' + util.guid();

	  return { id: id, depends: depends, factory: factory, anonymous: anonymous };
		}

/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var klass = __webpack_require__(11);
	var util = __webpack_require__(2);
	var log = __webpack_require__(6);

	var assert = util.assert;

	module.exports = klass({
	  init: function init(loader) {
	    this.loader = loader;
	    this.aliasCache = {};
	  },

	  require: function require(depends, callback) {
	    depends = util.isArray(depends) ? depends : [depends];

	    var module = {
	      proxy: true,
	      id: '____require' + util.guid(),
	      depends: depends,
	      factory: function factory() {
	        return arguments;
	      }
	    };

	    load(this, module, function () {
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

	  var loadlist = module.loadlist || (module.loadlist = []);
	  loadlist.push(callback);
	  if (loadlist.length > 1) {
	    log.debug('module is in loading: ' + module.id);
	    return;
	  }

	  loadDepends(self, module, function () {
	    compile(self, module, function () {
	      log.debug(module.id + ' is loaded', module.exports);
	      module.loadtimes = loadlist.length;
	      delete module.loadlist;
	      util.each(loadlist, function (index, fn) {
	        fn();
	      });
	    });
	  });
	}
	//~ load

	var rRelative = /^\.\.?\//;

	function loadDepends(self, module, callback) {
	  var loader = self.loader;
	  var modules = loader.modules;

	  var depends = module.depends;
	  if (depends.length === 0) {
	    return callback();
	  }

	  var adepends = module.adepends = [];
	  var rpath = util.dirname(module.id);
	  util.each(depends, function (index, id) {
	    adepends[index] = rRelative.test(id) ? util.join(rpath, id) : id;
	  });

	  log.debug('try load depends for: ' + module.id, adepends);

	  // 并行加载依赖模块
	  var n = adepends.length;
	  var count = 0;

	  var aliasCache = self.aliasCache;

	  util.each(adepends, function (index, id) {
	    var aid = aliasCache[id] || loader.trigger('alias', id);
	    if (aid && id !== aid) {
	      log.debug('alias ' + id + ' -> ' + aid);
	      id = aid;
	      aliasCache[id] = id;
	      adepends[index] = id;
	    }

	    var called = false;
	    var cb = function cb() {
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
	    var o = modules[id];
	    if (o) {
	      load(self, o, cb);
	      return;
	    }

	    // 依赖的模块是异步加载
	    loadAsync(self, id, function (lo) {
	      load(self, lo, cb);
	    });
	  });
	}
	//~ loadDepends

	function compile(self, module, callback) {
	  var loader = self.loader;
	  var modules = loader.modules;

	  loader.trigger('compile', module);

	  var factory = module.factory;
	  if (typeof factory === 'function') {
	    (function () {
	      var depends = module.adepends;
	      var proxy = { id: module.id, exports: {} };
	      var list = [];

	      depends && depends.length && util.each(depends, function (index, id) {
	        var o = modules[id];
	        assert(o && 'exports' in o, 'module should already loaded: ' + id);
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
	    })();
	  }

	  module.exports = factory;
	  callback();
	}
	//~ compile

	var requestList = {};

	function loadAsync(self, id, callback) {
	  var loader = self.loader;
	  var modules = loader.modules;

	  var url = loader.trigger('resolve', id);
	  if (!url) {
	    loader.trigger('error', new Error('can not resolve module: ' + id));
	    return;
	  }

	  log.debug('resolve ' + id + ' -> ' + url);

	  var list = requestList[id] || (requestList[id] = []);

	  var cb = function cb() {
	    var o = modules[id];
	    if (!o) {
	      loader.trigger('error', new Error('can not find module: ' + id));
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

	  var options = {
	    id: id,
	    url: url,
	    namespace: loader.namespace
	  };

	  log.debug('try request: ' + url);
	  loader.trigger('request', options, function () {
	    delete requestList[id];
	    util.each(list, function (index, fn) {
	      fn();
	    });
	  });
	}
	//~ loadAsync

/***/ },
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var log = __webpack_require__(6);

	/* global window, document */

	var rCss = /\.css(\?|$)/;

	exports.postLoadScript = null;

	exports.load = function (url, options) {
	  var type = rCss.test(url) ? 'css' : 'script';
	  return exports[type](url, options);
	};

	var currentlyAddingScript = undefined;

	exports.script = function (url, options) {
	  options = options || {};

	  var node = doc.createElement('script');
	  var removeNode = !log.isEnabled('debug');

	  onLoadAssets(node, url, removeNode, options, function () {
	    if (exports.postLoadScript) {
	      exports.postLoadScript(url, options);
	      exports.postLoadScript = null;
	    }
	  });

	  node.async = 'async';
	  if (options.namespace) {
	    node.setAttribute('data-namespace', options.namespace);
	  }
	  node.src = url;

	  if (options.charset) {
	    node.charset = options.charset;
	  }

	  currentlyAddingScript = node;
	  append(node);
	  currentlyAddingScript = null;
	};
	//~ script

	var rWebKit = /.*webkit\/?(\d+)\..*/;
	var rMobile = /mobile/;

	var UA = window.navigator.userAgent.toLowerCase();
	var webkitVersion = rWebKit.exec(UA);
	var isOldWebKit = webkitVersion ? webkitVersion[1] * 1 < 536 : false;
	var isPollCSS = isOldWebKit || !webkitVersion && rMobile.test(UA);

	exports.css = function (url, options) {
	  options = options || {};

	  var node = doc.createElement('link');

	  node.rel = 'stylesheet';
	  node.href = url;

	  if (options.charset) {
	    node.charset = options.charset;
	  }

	  if (!('onload' in node) || isPollCSS) {
	    setTimeout(function () {
	      poll(node, options);
	    }, 1);
	  } else {
	    onLoadAssets(node, url, false, options);
	  }

	  append(node);
	};
	//~ css

	var rLoadSheetError = /security|denied/i;
	function poll(node, options) {
	  var flag = false;

	  setTimeout(function () {
	    if (!flag) {
	      flag = true;
	      options.error && options.error(new Error('poll request css timeout'));
	    }
	  }, options.timeout || 10000);

	  var fn = function fn() {
	    var isLoaded = false;
	    try {
	      isLoaded = !!node.sheet;
	    } catch (e) {
	      isLoaded = rLoadSheetError.test(e.message);
	    }

	    if (!flag) {
	      if (isLoaded) {
	        flag = true;
	        options.success && options.success();
	      } else {
	        setTimeout(fn, 20);
	      }
	    }
	  };

	  fn();
	}

	var rReadyStates = /loaded|complete|undefined/;

	/* eslint max-params: [2, 5] */
	function onLoadAssets(node, url, removeNode, options, fn) {
	  node.onload = node.onreadystatechange = function (event) {
	    event = event || window.event || {};
	    if (event.type === 'load' || rReadyStates.test('' + node.readyState)) {
	      node.onload = node.onreadystatechange = node.onerror = null;
	      removeNode && head.removeChild(node);
	      fn && fn();
	      options.success && options.success();
	    }
	  };

	  node.onerror = function () {
	    node.onload = node.onreadystatechange = node.onerror = null;
	    var e = new Error('load assets error: ' + url);
	    options.error && options.error(e);
	  };
	}

	var doc = document;
	var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
	var baseElement = doc.getElementsByTagName('base')[0];

	function append(node) {
	  baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
	}

	// from seajs
	var interactiveScript = undefined;

	exports.getCurrentScript = function () {
	  if (currentlyAddingScript) {
	    return currentlyAddingScript;
	  }

	  // For IE6-9 browsers, the script onload event may not fire right
	  // after the script is evaluated. Kris Zyp found that it
	  // could query the script nodes and the one that is in "interactive"
	  // mode indicates the current script
	  // ref: http://goo.gl/JHfFW
	  if (interactiveScript && interactiveScript.readyState === 'interactive') {
	    return interactiveScript;
	  }

	  var scripts = head.getElementsByTagName('script');

	  for (var i = scripts.length - 1; i >= 0; i--) {
	    var script = scripts[i];
	    if (script.readyState === 'interactive') {
	      interactiveScript = script;
	      return interactiveScript;
	    }
	  }
		};

/***/ },
/* 18 */,
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(2);
	var log = __webpack_require__(6);
	var klass = __webpack_require__(11);
	var Event = __webpack_require__(8);
	var Config = __webpack_require__(10);
	var Define = __webpack_require__(13);
	var Require = __webpack_require__(15);
	var Request = __webpack_require__(20);

	module.exports = klass({
	  init: function init(namespace, options) {
	    var ns = namespace;
	    var opt = options || {};

	    this.namespace = ns;
	    this.options = opt;

	    _init(this);
	    handleError(this);
	    handleAlias(this);
	    handleResolve(this);
	    handleRequest(this);
	    defineSpecial(this);

	    opt.autoloadAnonymous && loadAnonymous(this);
	  }
	});

	function _init(self) {
	  var modules = self.modules = {};

	  new Event(self); // eslint-disable-line

	  var config = new Config();
	  var define = new Define(self);
	  var require = new Require(self);

	  if (log.isEnabled('debug')) {
	    self._config = config;
	    self._define = define;
	    self._require = require;
	  }

	  self.config = function (name, value) {
	    return value === undefined ? config.get(name) : config.set(name, value);
	  };

	  self.define = util.proxy(define, 'define');
	  self.require = util.proxy(require, 'require');

	  self.hasDefine = function (id) {
	    return !!modules[id];
	  };

	  self.getModules = function () {
	    return modules;
	  };

	  self.resolve = function (id) {
	    return self.trigger('resolve', id);
	  };

	  self.undefine = function (id) {
	    delete modules[id];
	  };
	}

	function handleError(self) {
	  self.on('error', function (e) {
	    log.error(e.stack);
	  });
	}

	function handleAlias(self) {
	  self.on('alias', function (id) {
	    return filter(self.config('alias'), function (index, alias) {
	      return typeof alias === 'function' ? alias(id) : alias[id];
	    });
	  });
	}

	var rAbs = /(^(\w+:)?\/\/)|(^\/)/;

	function handleResolve(self) {
	  self.on('resolve', function (id) {
	    var url = filter(self.config('resolve'), function (index, resolve) {
	      return resolve(id);
	    });

	    if (!url && rAbs.test(id)) {
	      url = id;
	    }

	    return url;
	  });
	}

	function handleRequest(self) {
	  var request = new Request(self);
	  self.on('request', function (options, callback) {
	    request.handle(options, callback);
	  });
	}

	function defineSpecial(self) {
	  self.define('require', function () {
	    return self.require;
	  });

	  self.define('module', function () {
	    return {
	      $compile: function $compile(module) {
	        return module;
	      }
	    };
	  });

	  self.define('exports', function () {
	    return {
	      $compile: function $compile(module) {
	        return module.exports;
	      }
	    };
	  });
	}

	function loadAnonymous(self) {
	  self.on('define', function (module) {
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
	  for (var i = 0, c = list.length; i < c; i++) {
	    var v = fn(i, list[i]);
	    if (v) {
	      return v;
	    }
	  }
		}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var klass = __webpack_require__(11);
	var util = __webpack_require__(2);
	var log = __webpack_require__(6);

	var rFile = /\.\w+(\?|$)/;

	module.exports = klass({
	  init: function init(loader) {
	    this.loader = loader;
	  },

	  handle: function handle(options, callback) {
	    var loader = this.loader;
	    var handler = loader.config('requestHandler');
	    if (handler) {
	      return handler(options, callback);
	    }

	    if (!process.browser) {
	      throw new Error('requestHandler not exists');
	    }

	    var modules = loader.modules;
	    var id = options.id;
	    var url = options.url;

	    var opts = loader.config('requestOptions');
	    opts = typeof opts === 'function' ? opts(options) : opts;
	    opts = util.extend({ id: id, namespace: options.namespace }, opts);

	    opts.success = function () {
	      log.debug('request assets success: ' + url, options);
	      // define a proxy module for just url request
	      if (!modules[id] && rFile.test(id)) {
	        loader.define(id);
	        modules[id].file = true;
	      }
	      callback();
	    };

	    opts.error = function (e) {
	      log.debug('request assets error: ' + url, e);
	      loader.trigger('error', e, options);
	    };

	    log.debug('request assets: ' + url, options);
	    var assets = __webpack_require__(17);
	    assets.load(url, opts);
	  }
		});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }
/******/ ]);
//# sourceMappingURL=xloader.js.map