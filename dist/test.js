var test =
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

	'use strict';

	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(7);
	__webpack_require__(9);
	__webpack_require__(12);
	__webpack_require__(14);

	__webpack_require__(16);

	__webpack_require__(18);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(2);

	describe('util', function () {
	  it('isArray', function () {
	    var isArray = util.__test.isArray;
	    isArray([1, 2, 3]).should.true();
	    isArray('123').should.false();
	    isArray(arguments).should.false();
	  });

	  it('extend', function () {
	    var o = util.extend({ a: 1, b: 2, d: 'd' }, { b: 3, c: 4, d: null, e: undefined, f: 0 });
	    o.should.eql({ a: 1, b: 3, c: 4, d: 'd', f: 0 });
	  });

	  it('each', function () {
	    var list = [1, 2, 3, 4];
	    var s = 0;
	    util.each(list, function (index, value) {
	      s += value;
	    });
	    s.should.equal(10);

	    var o = { a: 1, b: 2, c: 3 };
	    s = '';
	    util.each(o, function (k, v) {
	      s += k + '=' + v + ';';
	    });

	    s.should.equal('a=1;b=2;c=3;');
	  });

	  it('map', function () {
	    var list = [1, 2, 3, 4, 5];
	    list = util.map(list, function (i, v) {
	      if (i > 1) {
	        return v * 2;
	      }
	      return undefined;
	    });

	    list.should.eql([6, 8, 10]);
	  });

	  it('proxy', function () {
	    var o = {
	      m: function m() {
	        return this.n;
	      },
	      n: 100
	    };
	    var fn = util.proxy(o, 'm');
	    fn().should.equal(100);
	  });

	  it('assert', function () {
	    (function () {
	      util.assert(true, 'assert true');
	    }).should.not.throw();

	    (function () {
	      util.assert(false, 'assert false');
	    }).should.throw();
	  });

	  it('guid', function () {
	    var now = util.guid();
	    now.should.be.type('number');
	    (util.guid() - now).should.equal(1);
	  });

	  it('dirname', function () {
	    util.dirname('lang/core').should.equal('lang');
	    util.dirname('hello/abcd/').should.equal('hello');
	    util.dirname('hi').should.equal('');
	  });

	  it('join', function () {
	    util.join('aaa/bbb/ccc', '.././.././zzz').should.equal('aaa/zzz');
	    util.join('aaa', 'bbb').should.equal('aaa/bbb');
	    util.join('', '../render.art').should.equal('../render.art');
	  });
		});

/***/ },
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
	  path = parent ? parent + '/' + path : path;
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sinon = __webpack_require__(4);
	var log = __webpack_require__(5);

	/* global beforeEach, afterEach */

	describe('log', function () {
	  beforeEach(function () {
	    this.lastLevel = log.level;
	    this.lastFilter = log.filter;
	    sinon.spy(log, 'handler');
	  });

	  afterEach(function () {
	    log.level = this.lastLevel;
	    log.filter = this.lastFilter;
	    log.handler.restore();
	  });

	  it('test on log.level=info', function () {
	    log.level = 'info';
	    log.filter = false;

	    log.info('hello');
	    log.handler.called.should.true();

	    log.handler.reset();

	    log.warn('world');
	    log.handler.called.should.true();

	    log.handler.reset();

	    log.debug('my');
	    log.handler.called.should.false();

	    log.handler.reset();

	    log.error('some error');
	    log.handler.called.should.true();
	  });

	  it('test on log.level=warn', function () {
	    log.level = 'warn';
	    log.filter = false;

	    log.debug('hello');
	    log.handler.called.should.false();

	    log.handler.reset();

	    log.warn('world');
	    log.handler.called.should.true();

	    log.handler.reset();

	    log.info('loader');
	    log.handler.called.should.false();

	    log.handler.reset();

	    log.error('some error');
	    log.handler.called.should.true();
	  });
		});

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = sinon;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	/* eslint no-console: 0 */

	var util = __webpack_require__(2);

	var LEVEL = { none: 0, error: 1, warn: 2, info: 3, debug: 4 };
	var slice = [].slice;

	var log = module.exports = {};

	log.level = 'warn';
	log.filter = false;

	log.isEnabled = function (type) {
	  return LEVEL[type] <= LEVEL[log.level];
	};

	util.each(LEVEL, function (type) {
	  log[type] = function () {
	    if (log.isEnabled(type)) {
	      var args = slice.call(arguments, 0);
	      if (!log.filter || log.filter(args[0])) {
	        args[0] = '[loader] ' + args[0];
	        log.handler(type, args);
	      }
	    }
	  };
	});

	log.handler = typeof console !== 'undefined' ? function (type, args) {
	  if (console[type]) {
	    console[type].apply(console, args);
	  }
	} : function () {};

	var filter = process.env.XLOADER_LOG; // eslint-disable-line
	if (process.browser) {
	  var re = /\bxloader\.log=([^&]+)/;
	  var match = re.exec(window.location.search); // eslint-disable-line
	  filter = match && match[1];
	}

	if (filter) {
	  (function () {
	    log.level = 'debug';
	    filter = filter.replace(/([.\[\]\(\)\{\}^$\\?+])/g, '\\$1').replace(/\*/g, '.*');
	    var rFilter = new RegExp('^' + filter + '$');
	    log.filter = function (text) {
	      return rFilter.test(text);
	    };
	  })();
		}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Event = __webpack_require__(8);

	describe('event', function () {
	  var event = new Event();

	  it('支持事件基本操作', function () {
	    var s = 0;

	    var fn1 = function fn1(n) {
	      s += n;
	    };

	    var fn2 = function fn2(a, b) {
	      s *= a + b;
	    };

	    event.on('test', fn1);
	    event.on('test', fn2);

	    event.trigger('test', 3, 4);
	    s.should.equal(21);

	    event.off('test', fn1);
	    event.trigger('test', 5, 2);
	    s.should.equal(147);

	    event.off('test', fn2);
	    event.trigger('test', 3, 6);
	    s.should.equal(147);

	    // 关闭不存在在的事件也不会报错
	    event.off('notexist', fn1);
	  });

	  it('事件支持返回值, 如果有返回值(非null或非undefined)，则退出事件循环', function () {
	    var s = 0;
	    event.on('click', function () {
	      s += 1;
	      return 'hello';
	    });
	    event.on('click', function () {
	      s += 1;
	    });

	    var ret = event.trigger('click');
	    ret.should.equal('hello');
	    s.should.equal(1);
	  });

	  it('让普通对象有事件能力', function () {
	    var o = {
	      set: function set(name, value) {
	        this[name] = value;
	        this.trigger('set', name, value);
	      }
	    };

	    new Event(o); // eslint-disable-line

	    var data = null;

	    o.on('set', function (name, value) {
	      this.dirty = true;
	      data = [name, value];
	    });

	    o.set('version', '2.3');

	    o.version.should.equal('2.3');
	    o.dirty.should.true();

	    data.should.eql(['version', '2.3']);
	  });
		});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var log = __webpack_require__(5);

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Config = __webpack_require__(10);

	describe('config', function () {
	  it('设置和获取配置', function () {
	    var config = new Config();

	    config.set('root', '/xloader');
	    config.get('root').should.equal('/xloader');

	    config.get('alias').should.eql([]);

	    config.set('alias', { a: 'b' });
	    config.get('alias').should.eql([{ a: 'b' }]);

	    config.set('alias', { other: 'other' });
	    config.get('alias').should.eql([{ a: 'b' }, { other: 'other' }]);

	    config.get('resolve').should.eql([]);
	  });
		});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var klass = __webpack_require__(11);
	var log = __webpack_require__(5);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sinon = __webpack_require__(4);

	var Define = __webpack_require__(13);
	var log = __webpack_require__(5);

	describe('define', function () {
	  var loader = { modules: {}, trigger: function trigger() {} };
	  var mods = loader.modules;
	  var x = new Define(loader);
	  var fn = function fn() {};

	  it('define(id, depends, factory)', function () {
	    x.define('a', ['b', 'c', 'd'], fn);
	    mods.a.should.eql({
	      id: 'a',
	      depends: ['b', 'c', 'd'],
	      factory: fn,
	      anonymous: false
	    });
	  });

	  it('define(id, factory)', function () {
	    x.define('b', fn);
	    mods.b.should.eql({
	      id: 'b',
	      depends: [],
	      factory: fn,
	      anonymous: false
	    });
	  });

	  it('define(a, depends)', function () {
	    x.define('c', ['b', 'c', 'd']);
	    mods.c.should.eql({
	      id: 'c',
	      depends: ['b', 'c', 'd'],
	      factory: undefined,
	      anonymous: false
	    });
	  });

	  it('define(depends, factory)', function () {
	    var o = x.define(['b', 'c', 'd'], fn);
	    /^____anonymous\d+$/.test(o.id).should.true();
	    o.anonymous.should.true();
	  });

	  it('define(fn)', function () {
	    var o = x.define(fn);
	    o.factory.should.equal(fn);
	    o.anonymous.should.true();
	  });

	  it('可以响应define事件', function () {
	    sinon.spy(loader, 'trigger');

	    x.define('test/a', ['a', 'b'], function () {});
	    var o = mods['test/a'];

	    loader.trigger.args[0].should.eql(['define', o]);
	  });

	  it('重复define模块会警告', function () {
	    sinon.spy(log, 'warn');

	    x.define('test/hello', 'hello world');
	    x.define('test/hello', 'hello world');
	    log.warn.called.should.true();
	    log.warn.restore();
	  });
		});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(2);
	var log = __webpack_require__(5);
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sinon = __webpack_require__(4);

	var Event = __webpack_require__(8);
	var Define = __webpack_require__(13);
	var Require = __webpack_require__(15);

	/* eslint max-nested-callbacks: [2, 4] */

	describe('require', function () {
	  it('使用require载入已定义的模块', function (done) {
	    var loader = create();
	    loader.define('a', ['b', 'c'], function (b, c) {
	      return [b, c];
	    });

	    loader.define('b', 'module b');
	    loader.define('c', 'module c');

	    loader.require(['a'], function (a) {
	      a.should.eql(['module b', 'module c']);
	      done();
	    });
	  });

	  it('相对路径', function (done) {
	    var loader = create();
	    loader.define('lib/util/a', ['./b', '../core/c', '../d'], function (b, c, d) {
	      return [b, c, d];
	    });

	    loader.define('lib/util/b', 'module b');
	    loader.define('lib/core/c', 'module c');
	    loader.define('lib/d', 'module d');

	    loader.require('lib/util/a', function (a) {
	      a.should.eql(['module b', 'module c', 'module d']);
	      done();
	    });
	  });

	  describe('使用require载入异步模块', function () {
	    var loader = create();
	    stub(loader);

	    it('最简单场景', function (done) {
	      loader.require(['simple'], function (simple) {
	        simple.should.equal('/assets/simple.js');
	        done();
	      });
	    });

	    it('有依赖的模块加载', function (done) {
	      loader.define('a', ['b', 'c'], 'module a');
	      loader.define('b', ['c', 'd', 'e'], 'module b');
	      // c, d, e is async
	      loader.require(['d', 'e', 'a', 'c', 'b'], function (d, e, a, c) {
	        // eslint-disable-line
	        a.should.equal('module a');
	        c.should.equal('/assets/c.js');
	        e.should.equal('/assets/e.js');
	        done();
	      });
	    });

	    function testForError(name, error, done) {
	      var fn = sinon.spy();
	      loader.on('error', fn);
	      loader.require(name);
	      setTimeout(function () {
	        fn.args[0].should.match(error);
	        loader.off('error', fn);
	        done();
	      }, 500); // should > 300ms, see stub
	    }

	    it('异常情况: not resolved', function (done) {
	      testForError('not-resolved', /can not resolve module: not-resolved/, done);
	    });

	    it('异常情况: not find module', function (done) {
	      testForError('not-exists', /can not find module: not-exists/, done);
	    });
	  });

	  it('compile error', function (done) {
	    var loader = create();
	    var fn = sinon.spy();
	    loader.on('error', fn);

	    loader.define('test', function () {
	      throw new Error('some error happen');
	    });

	    loader.require('test', function (test) {
	      (test === null).should.true();
	      fn.args[0].should.match(/some error happen/);
	      done();
	    });
	  });

	  it('介入compile流程', function () {
	    var loader = create();

	    loader.on('compile', function (module) {
	      if (module.factory === 'a') {
	        module.factory = 'b';
	      }
	    });

	    loader.define('compile/a', 'a');
	    loader.require(['compile/a'], function (a) {
	      a.should.equal('b');
	    });
	  });
	});

	function create() {
	  var loader = { modules: {} };
	  new Event(loader); // eslint-disable-line

	  var d = new Define(loader);
	  var r = new Require(loader);

	  loader.define = d.define.bind(d);
	  loader.require = r.require.bind(r);

	  return loader;
	}

	function stub(loader) {
	  loader.on('resolve', function (id) {
	    if (id === 'not-resolved') {
	      return null;
	    }
	    return '/assets/' + id + '.js';
	  });

	  loader.on('request', function (options, cb) {
	    var id = options.id;
	    setTimeout(function () {
	      if (id === 'not-exists') {
	        cb();
	        return;
	      }

	      loader.define(id, function () {
	        return options.url;
	      });

	      cb();
	    }, 300);
	  });
		}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var klass = __webpack_require__(11);
	var util = __webpack_require__(2);
	var log = __webpack_require__(5);

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
	    }, function (reason) {
	      var e = new Error('load dependency error, ' + module.id + ' -> ' + id + ', reason: ' + reason);
	      loader.trigger('error', e);
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

	function loadAsync(self, id, callback, error) {
	  var loader = self.loader;
	  var modules = loader.modules;

	  var url = loader.trigger('resolve', id);
	  if (!url) {
	    error('can not resolve module: ' + id);
	    return;
	  }

	  log.debug('resolve ' + id + ' -> ' + url);

	  var list = requestList[id] || (requestList[id] = []);

	  var cb = function cb() {
	    var o = modules[id];
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	'use stricg';

	var assets = __webpack_require__(17);

	describe('assets', function () {
	  it('assets.css(url, options)', function (done) {
	    assets.css('/test/browser/fixtures/ui.css', {
	      success: done
	    });
	  });

	  it('assets.css() - load error', function (done) {
	    assets.css('/404', {
	      error: function error(e) {
	        e.should.be.an.Error();
	        done();
	      }
	    });
	  });

	  it('assets.script(url, options)', function (done) {
	    assets.script('/test/browser/fixtures/ui.js', {
	      success: function success() {
	        global.fixturesUI.success.should.true();
	        delete global.fixturesUI;
	        done();
	      }
	    });
	  });

	  it('assets.script() - load error', function (done) {
	    assets.script('/404', {
	      error: function error(e) {
	        e.should.be.an.Error();
	        e.should.match(/load assets error/);
	        done();
	      }
	    });
	  });
		});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var log = __webpack_require__(5);

	/* global window, document */

	var rCss = /\.css(\?|$)/;

	exports.load = function (url, options) {
	  var type = rCss.test(url) ? 'css' : 'script';
	  return exports[type](url, options);
	};

	exports.script = function (url, options) {
	  options = options || {};

	  var node = doc.createElement('script');
	  var removeNode = !log.isEnabled('debug');

	  onLoadAssets(node, url, removeNode, options);

	  if (options.async !== false) {
	    node.async = 'async';
	  }
	  if (options.id) {
	    node.setAttribute('data-id', options.id);
	  }
	  if (options.namespace) {
	    node.setAttribute('data-namespace', options.namespace);
	  }
	  node.src = url;

	  if (options.charset) {
	    node.charset = options.charset;
	  }

	  append(node);
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

/***/ },
/* 18 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/* globa document */

	describe('use/simple', function () {
	  var x = global.xloader;

	  it('define and require module', function (done) {
	    x.define('use/simple/a', function () {
	      return 'a';
	    });

	    x.require('use/simple/a', function (a) {
	      a.should.equal('a');
	      done();
	    });
	  });

	  it('define and require module that with deps', function (done) {
	    x.define('use/simple/b', ['./c', 'use/simple/d'], function (c, d) {
	      return [c, d];
	    });

	    x.define('use/simple/c', 'c');
	    x.define('use/simple/d', ['./c'], function (c) {
	      return c + 'd';
	    });

	    x.require(['use/simple/b', 'use/simple/c'], function (b, c) {
	      b.should.eql(['c', 'cd']);
	      c.should.equal('c');
	      done();
	    });
	  });

	  it('config resolve for loading async module ', function (done) {
	    x.config('resolve', function (id) {
	      var re = /^use\/async\/(.*)$/;
	      var match = re.exec(id);
	      if (match) {
	        return '/test/browser/fixtures/use/async/' + match[1] + '.js';
	      }
	      return null;
	    });

	    x.require('use/async/d', function (d) {
	      d.a.should.equal('a');
	      d.b.should.equal('b');
	      d.c.result.should.eql(['b', 'c']);
	      done();
	    });
	  });

	  it('config requestOptions.async', function (done) {
	    var prefix = '/test/browser/fixtures/';
	    var $$ = document.querySelectorAll.bind(document);

	    x.require(prefix + 'async-1.js', function () {
	      var node1 = $$('[data-id="' + prefix + 'async-1.js"]')[0];
	      node1.getAttribute('async').should.equal('');

	      var z = x.new();
	      z.config('requestOptions', { async: false });

	      z.require(prefix + 'async-2.js', function () {
	        var node2 = $$('[data-id="' + prefix + 'async-2.js"]')[0];
	        (node2.getAttribute('async') === null).should.true();
	        done();
	      });
	    });
	  });
		});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map