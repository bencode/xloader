'use strict';


const sinon = require('sinon');

const log = require('../src/log');
const Loader = require('../src/loader');


/* eslint max-nested-callbacks: [2, 5] */


describe('loader', function() {
  it('可以自定义一个加载器', function() {
    const x = new Loader('x');
    x.define.should.be.type('function');
    x.require.should.be.type('function');
  });


  it('加载器支持事件模型', function() {
    const x = new Loader('x');
    x.on.should.be.type('function');
    x.off.should.be.type('function');
    x.trigger.should.be.type('function');
  });


  it('使用加载器定义和加载模块', function(done) {
    const x = new Loader('x');

    x.define('a', ['b', 'c'], function(b, c) {
      return [b, c];
    });

    x.define('b', function() {
      return 'module b';
    });

    x.define('c', function() {
      return 'module c';
    });

    x.require(['a', 'b', 'c'], function(a, b, c) {
      a.should.be.eql(['module b', 'module c']);
      b.should.be.equal('module b');
      c.should.be.equal('module c');

      done();
    });
  });


  it('加载器支持alias配置', function() {
    const x = new Loader('x');
    x.config('alias', { a: 'module/a' });
    x.config('alias', function(id) {
      if (/^t\./.test(id)) {
        return id.replace(/^t\./, 'test.');
      }
    });

    x.define('module/a', 'module a');
    x.require('a').should.be.equal('module a');

    x.define('test.a', 'test a');
    x.require('t.a').should.be.equal('test a');
  });


  it('加载器支持resolve配置', function(done) {
    const x = new Loader('xloader');
    x.config('resolve', function(id) {
      if (/^lang\//.test(id)) {
        return '/butterfly/lib/' + id + '.js';
      }
    });

    x.config('resolve', function(id) {
      if (/^lofty\//.test(id)) {
        return '/' + id + '.js';
      }
    });

    const Request = require('../src/request');
    sinon.stub(Request.prototype, 'handle', function(options, callback) {
      setTimeout(function() {
        x.define(options.id, function() {
          return options.url;
        });
        callback();
      }, 100);
    });

    x.resolve('lofty/ui/simple').should.be.equal('/lofty/ui/simple.js');

    x.require(['lang/class', 'lofty/ui/tab'], function(_, tag) {
      _.should.be.equal('/butterfly/lib/lang/class.js');
      tag.should.be.equal('/lofty/ui/tab.js');
      done();
    });
  });


  it('特殊模块的使用: require, module, exports', function(done) {
    const x = new Loader('x');
    x.define('a', 'module a');
    x.define('b', ['require', 'exports'], function(require, exports) {
      exports.spec = require('a');
    });
    x.define('c', ['module', 'b'], function(module, b) {
      module.exports = function() {
        return b;
      };
    });

    x.require(['b', 'c'], function(b, c) {
      b.spec.should.be.equal('module a');
      c().should.be.equal(b);
      done();
    });
  });


  it('匿名模块自动加载', function(done) {
    const x = new Loader('x', { autoloadAnonymous: true });
    x.define('a', 'module a');
    x.define('b', ['a'], 'module b');
    x.define(['b', 'a'], function(b, a) {
      b.should.be.equal('module b');
      a.should.be.equal('module a');
      done();
    });
  });


  it('使用加载器其他方法: hasDefine, getModules, resolve, undefine', function() {
    const x = new Loader('x');

    x.define('a', 'module a');
    x.define('b', 'module b');
    x.define('c', 'module c');

    x.config('resolve', function(id) {
      if (id === 'c') {
        return '/assets/c.js';
      }
    });

    x.hasDefine('a').should.be.true();

    const mods = x.getModules();
    mods.a.should.not.be.undefined();
    mods.b.should.not.be.undefined();

    x.resolve('a');
    (x.resolve('a') === undefined).should.be.true();
    x.resolve('c').should.be.equal('/assets/c.js');
    x.resolve('/a.js').should.be.equal('/a.js');

    x.undefine('a');
    (mods.a === undefined).should.be.true();
  });


  it('debug模式下, 会产生几个方便调试的对象', function() {
    log.level = 'debug';
    sinon.stub(log, 'debug');

    const x = new Loader('x');
    x._config.should.not.be.undefined();
    x._define.should.not.be.undefined();
    x._require.should.not.be.undefined();

    log.level = 'error';
    log.debug.restore();
  });


  it('error事件默认会打出错日志', function(done) {
    sinon.stub(log, 'error');
    const x = new Loader('x');
    x.define('one', function() {
      throw new Error('compile error');
    });

    x.require('one', function(one) {
      (one === null).should.be.true();
      log.error.args[0].should.match(/compile error/);
      done();
    });
  });
});
