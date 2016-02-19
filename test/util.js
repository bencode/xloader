'use strict';


const util = require('../src/util');


describe('util', function() {
  it('isArray', function() {
    const isArray = Array.isArray;
    Array.isArray = null;
    const path = require.resolve('../src/util');
    delete require.cache[path];
    const t = require(path);
    Array.isArray = isArray;

    t.isArray([1, 2, 3]).should.be.true();
    t.isArray('123').should.be.false();
    t.isArray(arguments).should.be.false();
  });


  it('extend', function() {
    const o = util.extend(
        { a: 1, b: 2, d: 'd' },
        { b: 3, c: 4, d: null, e: undefined, f: 0 });
    o.should.be.eql({ a: 1, b: 3, c: 4, d: 'd', f: 0 });
  });


  it('each', function() {
    const list = [1, 2, 3, 4];
    let s = 0;
    util.each(list, function(index, value) {
      s += value;
    });
    s.should.be.equal(10);

    const o = { a: 1, b: 2, c: 3 };
    s = '';
    util.each(o, function(k, v) {
      s += k + '=' + v + ';';
    });

    s.should.be.equal('a=1;b=2;c=3;');
  });


  it('map', function() {
    let list = [1, 2, 3, 4, 5];
    list = util.map(list, function(i, v) {
      if (i > 1) {
        return v * 2;
      }
      return undefined;
    });

    list.should.be.eql([6, 8, 10]);
  });


  it('proxy', function() {
    const o = {
      m: function() {
        return this.n;
      },
      n: 100
    };
    const fn = util.proxy(o, 'm');
    fn().should.be.equal(100);
  });


  it('assert', function() {
    (function() {
      util.assert(true, 'assert true');
    }).should.not.throw();

    (function() {
      util.assert(false, 'assert false');
    }).should.throw();
  });


  it('guid', function() {
    const now = util.guid();
    now.should.be.type('number');
    (util.guid() - now).should.be.equal(1);
  });


  it('when', function(done) {
    const works = [];
    for (let i = 0; i < 5; i++) {
      const k = i + 1;
      works.push(function(fn) {  // eslint-disable-line
        setTimeout(function() {
          fn(k);
          fn(k);    // will ignore
        }, 100);
      });
    }

    util.when(works, function(list) {
      for (let i = 0; i < 5; i++) {
        list[i].should.be.equal(i + 1);
      }

      done();
    });
  });


  it('isBrowser', function() {
    util.isBrowser.should.be.false();
  });
});
