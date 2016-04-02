'use strict';


const util = require('../lib/util');


describe('util', function() {
  it('isArray', function() {
    const isArray = util.__test.isArray;
    isArray([1, 2, 3]).should.true();
    isArray('123').should.false();
    isArray(arguments).should.false();
  });


  it('extend', function() {
    const o = util.extend(
        { a: 1, b: 2, d: 'd' },
        { b: 3, c: 4, d: null, e: undefined, f: 0 });
    o.should.eql({ a: 1, b: 3, c: 4, d: 'd', f: 0 });
  });


  it('each', function() {
    const list = [1, 2, 3, 4];
    let s = 0;
    util.each(list, function(index, value) {
      s += value;
    });
    s.should.equal(10);

    const o = { a: 1, b: 2, c: 3 };
    s = '';
    util.each(o, function(k, v) {
      s += k + '=' + v + ';';
    });

    s.should.equal('a=1;b=2;c=3;');
  });


  it('map', function() {
    let list = [1, 2, 3, 4, 5];
    list = util.map(list, function(i, v) {
      if (i > 1) {
        return v * 2;
      }
      return undefined;
    });

    list.should.eql([6, 8, 10]);
  });


  it('proxy', function() {
    const o = {
      m: function() {
        return this.n;
      },
      n: 100
    };
    const fn = util.proxy(o, 'm');
    fn().should.equal(100);
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
    (util.guid() - now).should.equal(1);
  });


  it('dirname', function() {
    util.dirname('lang/core').should.equal('lang');
    util.dirname('hello/abcd/').should.equal('hello');
    util.dirname('hi').should.equal('');
  });


  it('join', function() {
    util.join('aaa/bbb/ccc', '.././.././zzz')
        .should.equal('aaa/zzz');
    util.join('aaa', 'bbb').should.equal('aaa/bbb');
    util.join('', '../render.art').should.equal('../render.art');
  });
});
