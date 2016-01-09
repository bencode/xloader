'use strict';


const sinon = require('sinon');

const Event = require('../src/event');
const Define = require('../src/define');
const Require = require('../src/require');


/* eslint max-nested-callbacks: [2, 4] */


describe('require', function() {
  it('使用require载入已定义的模块', function(done) {
    const loader = create();
    loader.define('a', ['b', 'c'], function(b, c) {
      return [b, c];
    });

    loader.define('b', 'module b');
    loader.define('c', 'module c');

    loader.require(['a'], function(a) {
      a.should.be.eql(['module b', 'module c']);
      done();
    });
  });


  describe('使用require载入异步模块', function() {
    const loader = create();
    stub(loader);


    it('最简单场景', function(done) {
      loader.require(['simple'], function(simple) {
        simple.should.be.equal('/assets/simple.js');
        done();
      });
    });


    it('有依赖的模块加载', function(done) {
      loader.define('a', ['b', 'c'], 'module a');
      loader.define('b', ['c', 'd', 'e'], 'module b');
      // c, d, e is async
      loader.require(['d', 'e', 'a', 'c', 'b'], function(d, e, a, c) {   // eslint-disable-line
        a.should.be.equal('module a');
        c.should.be.equal('/assets/c.js');
        e.should.be.equal('/assets/e.js');
        done();
      });
    });


    function testForError(name, error, done) {
      const fn = sinon.spy();
      loader.on('error', fn);
      loader.require(name);
      setTimeout(function() {
        fn.args[0].should.match(error);
        loader.off('error', fn);
        done();
      }, 500);  // should > 300ms, see stub
    }


    it('异常情况: not resolved', function(done) {
      testForError('not-resolved', /can not resolve module: not-resolved/, done);
    });


    it('异常情况: not find module', function(done) {
      testForError('not-exists', /can not find module: not-exists/, done);
    });
  });


  it('compile error', function(done) {
    const loader = create();
    const fn = sinon.spy();
    loader.on('error', fn);

    loader.define('test', function() {
      throw new Error('some error happen');
    });

    loader.require('test', function(test) {
      (test === null).should.be.true();
      fn.args[0].should.match(/some error happen/);
      done();
    });
  });


  it('介入compile流程', function() {
    const loader = create();

    loader.on('compile', function(module) {
      if (module.factory === 'a') {
        module.factory = 'b';
      }
    });

    loader.define('compile/a', 'a');
    loader.require(['compile/a'], function(a) {
      a.should.be.equal('b');
    });
  });
});


function create() {
  const loader = { modules: {} };
  new Event(loader);  // eslint-disable-line

  const d = new Define(loader);
  const r = new Require(loader);

  loader.define = d.define.bind(d);
  loader.require = r.require.bind(r);

  return loader;
}


function stub(loader) {
  loader.on('resolve', function(id) {
    if (id === 'not-resolved') {
      return null;
    }
    return '/assets/' + id + '.js';
  });


  loader.on('request', function(options, cb) {
    const id = options.id;
    setTimeout(function() {
      if (id === 'not-exists') {
        return cb();
      }

      loader.define(id, function() {
        return options.url;
      });

      cb();
    }, 300);
  });
}
