describe('plugin/mdefine', function() {

    var mloader = butterfly('mloader', {
       autoloadAnonymous: true
    });

    var indexOf = function(list, value) {
        for (var i = 0; c = list.length; i < c; i++) {
            if (list[i] === value) {
                return i;
            }
        }
        return -1;
    };

    var resolve = function(id) {
        var list = ['mdefine/a', 'mdefine/b', 'mdefine/c'];
        var root = 'fixture/plugin/';
        if (indexOf(list, id) !== -1) {
            return root + id + '.js';
        }
    };

    butterfly.config('resolve', resolve);
    mloader.config('resolve', resolve);


    it('使用不同的loader截入模块', function(done) {
        var f1 = false;
        butterfly.require(['mdefine/a'], function(a) {
            f1 = true;
            expect(a).toBe(a);
        });

        var f2 = false;
        mloader.require(['mdefine/b'], function(b) {
            f2 = true;
            expect(b).toBe('b');
        });

        setTimeout(function() {
            expect(f1).toBeTruthy();
            expect(f2).toBeTruthy();
            done();
        }, 200);
    });


    it('不同的loader载入同一个模块', function(done) {
        var c1 = null;
        var c2 = null;

        butterfly.require(['mdefine/c'], function(c) {
            c1 = c;
        });

        mloader.require(['mdefine/c'], function(c) {
            c2 = c;
        })

        setTimeout(function() {
            expect(c1).toEqual(['a', 'b', 'c']);
            expect(c2).toEqual(['a', 'b', 'c']);
            expect(c1).not.toBe(c2);
            done();
        }, 200);
    });
});
