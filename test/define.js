'use strict';


const sinon = require('sinon');

const Define = require('../src/define');
const log = require('../src/log');


describe('define', function() {
  const loader = { modules: {}, trigger: function() {} };
  const mods = loader.modules;
  const x = new Define(loader);
  const fn = function() {};


  it('define(id, depends, factory)', function() {
    x.define('a', ['b', 'c', 'd'], fn);
    mods.a.should.be.eql({
      id: 'a',
      depends: ['b', 'c', 'd'],
      factory: fn,
      anonymous: false
    });
  });


  it('define(id, factory)', function() {
    x.define('b', fn);
    mods.b.should.be.eql({
      id: 'b',
      depends: [],
      factory: fn,
      anonymous: false
    });
  });


  it('define(a, depends)', function() {
    x.define('c', ['b', 'c', 'd']);
    mods.c.should.be.eql({
      id: 'c',
      depends: ['b', 'c', 'd'],
      factory: undefined,
      anonymous: false
    });
  });


  it('define(depends, factory)', function() {
    const o = x.define(['b', 'c', 'd'], fn);
    (/^____anonymous\d+$/).test(o.id).should.be.true();
    o.anonymous.should.be.true();
  });


  it('define(fn)', function() {
    const o = x.define(fn);
    o.factory.should.be.equal(fn);
    o.anonymous.should.be.true();
  });


  it('可以响应define事件', function() {
    sinon.spy(loader, 'trigger');

    x.define('test/a', ['a', 'b'], function() {});
    const o = mods['test/a'];

    loader.trigger.args[0].should.be.eql(['define', o]);
  });


  it('重复define模块会警告', function() {
    sinon.spy(log, 'warn');

    x.define('test/hello', 'hello world');
    x.define('test/hello', 'hello world');
    log.warn.called.should.be.true();
  });
});
