'use strict';


/* globa document */


describe('use/simple', function() {
  const x = global.xloader;

  it('define and require module', function(done) {
    x.define('use/simple/a', function() {
      return 'a';
    });

    x.require('use/simple/a', function(a) {
      a.should.equal('a');
      done();
    });
  });


  it('define and require module that with deps', function(done) {
    x.define('use/simple/b', ['./c', 'use/simple/d'], function(c, d) {
      return [c, d];
    });

    x.define('use/simple/c', 'c');
    x.define('use/simple/d', ['./c'], function(c) {
      return c + 'd';
    });


    x.require(['use/simple/b', 'use/simple/c'], function(b, c) {
      b.should.eql(['c', 'cd']);
      c.should.equal('c');
      done();
    });
  });


  it('config resolve for loading async module ', function(done) {
    x.config('resolve', function(id) {
      const re = /^use\/async\/(.*)$/;
      const match = re.exec(id);
      if (match) {
        return '/test/browser/fixtures/use/async/' + match[1] + '.js';
      }
      return null;
    });

    x.require('use/async/d', function(d) {
      d.a.should.equal('a');
      d.b.should.equal('b');
      d.c.result.should.eql(['b', 'c']);
      done();
    });
  });
});


