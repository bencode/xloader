'use strict';


describe('use/simple', function() {
  const x = global.xloader;

  it('define and require module', function(done) {
    x.define('use/simple/a', function() {
      return 'a';
    });

    x.require('use/simple/a', function(a) {
      a.should.be.equal('a');
      done();
    });
  });


  it('module with deps', function(done) {
    x.define('use/simple/b', ['./c', 'use/simple/d'], function(c, d) {
      return [c, d];
    });

    x.define('use/simple/c', 'c');
    x.define('use/simple/d', ['./c'], function(c) {
      return c + 'd';
    });


    x.require(['use/simple/b', 'use/simple/c'], function(b, c) {
      b.should.be.eql(['c', 'cd']);
      c.should.be.equal('c');
      done();
    });
  });


  it('async module', function(done) {
    x.config('resolve', function(id) {
      const re = /^use\/async\/(.*)$/;
      const match = re.exec(id);
      if (match) {
        return '/test/browser/fixtures/use/async/' + match[1] + '.js';
      }
      return null;
    });

    x.require('use/async/d', function(d) {
      d.a.should.be.equal('a');
      d.b.should.be.equal('b');
      d.c.result.should.be.eql(['b', 'c']);
      done();
    });
  });
});


