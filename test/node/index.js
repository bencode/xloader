'use strict';


const x = require('../../');


describe('node', function() {
  it('define and require module', function(done) {
    x.define('sum', function() {
      return function(a, b) {
        return a + b;
      };
    });

    x.require('sum', function(sum) {
      sum(1, 2).should.be.equal(3);
      done();
    });
  });


  it('load async module', function(done) {
    x.config('requestHandler', function(options, callback) {
      const match = (/^async\/(\w+)$/).exec(options.id);
      if (match) {
        const o = require('./async/' + match[1]);
        x.define(options.id, function() {
          return o;
        });
        callback();
      }
    });


    x.config('resolve', function(id) {
      return id;
    });


    x.require(['async/sum'], function(sum) {
      sum(1, 2).should.be.equal(3);
      done();
    });
  });
});
