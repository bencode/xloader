define('test/assets', ['assets'], function(assets) {

var $tag = function(tag) {
    return document.getElementsByTagName(tag);
};

describe('assets', function() {
    it('#css()', function(done) {
        var url = 'fixture/assets.css';
        var c1 = $tag('link').length;

        assets.css(url, {
            success: function() {
                var c2 = $tag('link').length;
                expect(c2 - c1).toBe(1);
                done();
            }
        });
    });


    it('#script()', function(done) {
        var url = 'fixture/assets.js';
        expect(window.test_assets).toBeUndefined();
        assets.script(url, {
            success: function() {
                expect(window.test_assets).toBe(101);
                done();
            }
        });
    });


    it('#load()', function() {
        spyOn(assets, 'script');
        spyOn(assets, 'css');

        assets.load('fixture/assets.css');
        expect(assets.css).toHaveBeenCalled();

        assets.load('fixture/assets.js');
        expect(assets.script).toHaveBeenCalled();
    });
});


});
