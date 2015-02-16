define('test/util', ['util'], function(util) {

describe('util', function() {

    it('isArray', function() {
        expect(util.isArray([1, 2, 3])).toBeTruthy();
        expect(util.isArray('123')).toBeFalsy();
        expect(util.isArray(arguments)).toBeFalsy();
    });


    it('extend', function() {
        var o = util.extend(
                { a: 1, b: 2, d: 'd'}, 
                { b: 3, c: 4, d: null, e: undefined, f: 0 });
        expect(o).toEqual({ a: 1, b: 3, c: 4, d: 'd', f: 0 });
    });


    it('each', function() {
        var list = [1, 2, 3, 4];
        var s = 0;
        util.each(list, function(index, value) {
            s += value;
        });
        expect(s).toBe(10);

        var o = { a: 1, b: 2, c: 3 };
        var s = '';
        util.each(o, function(k, v) {
            s += k + '=' + v + ';';
        });

        expect(s).toBe('a=1;b=2;c=3;');
    });


    it('map', function() {
        var list = [1, 2, 3, 4, 5];
        list = util.map(list, function(i, v) {
            if (i > 1) {
                return v * 2;
            }
        });

        expect(list).toEqual([6, 8, 10]);
    });


    it('proxy', function() {
        var o = { m: function() { return this.n; }, n: 100 };
        var fn = util.proxy(o, 'm');
        expect(fn()).toBe(100);
    });


    it('assert', function() {
        expect(function() {
            util.assert(true, 'assert true')
        }).not.toThrow();

        expect(function() {
            util.assert(false, 'assert false');
        }).toThrow();
    });


    it('guid', function() {
        var now = util.guid();
        expect(typeof now).toBe('number');
        expect(util.guid() - now).toBe(1);
    });


    it('when', function(done) {
        var works = [];
        for (var i = 0; i < 5; i++) {
            (function() {
                var k = i + 1;
                works.push(function(fn) {
                    setTimeout(function() {
                        fn(k);
                    }, 100);
                });
            })();
        }

        util.when(works, function(list) {
            for (var i = 0; i < 5; i++) {
                expect(list[i]).toBe(i + 1);
            }

            done();
        });
    });

});

});
