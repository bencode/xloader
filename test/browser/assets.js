'use stricg';


const assets = require('../../src/assets');


describe('assets', function() {
  it('assets.css(url, options)', function(done) {
    assets.css('/test/browser/fixtures/ui.css', {
      success: done
    });
  });


  it('assets.css() - load error', function(done) {
    assets.css('/404', {
      error: function(e) {
        e.should.be.an.Error();
        done();
      }
    });
  });


  it('assets.script(url, options)', function(done) {
    assets.script('/test/browser/fixtures/ui.js', {
      success: function() {
        global.fixturesUI.success.should.be.true();
        delete global.fixturesUI;
        done();
      }
    });
  });


  it('assets.script() - load error', function(done) {
    assets.script('/404', {
      error: function(e) {
        e.should.be.an.Error();
        e.should.match(/load assets error/);
        done();
      }
    });
  });
});
