'use strict';


const sinon = require('sinon');

const Define = require('../lib/define');
const log = require('../lib/log');


describe('define', function() {
  const loader = { modules: {}, trigger: function() {} };
  const mods = loader.modules;
  const x = new Define(loader);
  const fn = function() {};


  it('define(id, depends, factory)', function() {
    x.define('a', ['b', 'c', 'd'], fn);
    mods.a.should.eql({
      id: 'a',
      depends: ['b', 'c', 'd'],
      factory: fn,
      anonymous: false
    });
  });


  it('define(id, factory)', function() {
    x.define('b', fn);
    mods.b.should.eql({
      id: 'b',
      depends: [],
      factory: fn,
      anonymous: false
    });
  });


  it('define(a, depends)', function() {
    x.define('c', ['b', 'c', 'd']);
    mods.c.should.eql({
      id: 'c',
      depends: ['b', 'c', 'd'],
      factory: undefined,
      anonymous: false
    });
  });


  it('define(depends, factory)', function() {
    const o = x.define(['b', 'c', 'd'], fn);
    (/^____anonymous\d+$/).test(o.id).should.true();
    o.anonymous.should.true();
  });


  it('define(fn)', function() {
    const o = x.define(fn);
    o.factory.should.equal(fn);
    o.anonymous.should.true();
  });


  it('可以响应define事件', function() {
    sinon.spy(loader, 'trigger');

    x.define('test/a', ['a', 'b'], function() {});
    const o = mods['test/a'];

    loader.trigger.args[0].should.eql(['define', o]);
  });


  it('重复define模块会警告', function() {
    sinon.spy(log, 'warn');

    x.define('test/hello', 'hello world');
    x.define('test/hello', 'hello world');
    log.warn.called.should.true();
    log.warn.restore();
  });
});
