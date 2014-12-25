define('test/loader', ['global', 'loader'], function(global, Loader) {


describe('loader', function() {
    it('可以自定义一个加载器', function() {
        expect(global.aloader).toBeUndefined();
        new Loader('aloader');
        expect(global.aloader).toBeDefined();
    });


    it('加载器支持事件模型', function() {
        var b = new Loader('bloader');

        expect(typeof b.on).toBe('function');
        expect(typeof b.trigger).toBe('function');
        expect(typeof b.off).toBe('function');
    });


    it('使用加载器定义和加载模块', function(done) {
        var c = new Loader('cloader');

        c.define('a', ['b', 'c'], function(b, c) {
            return [b, c];
        });

        c.define('b', function() {
            return 'module b';
        });

        c.define('c', function() {
            return 'module c';
        });

        c.require(['a', 'b', 'c'], function(a, b, c) {
            expect(a).toEqual(['module b', 'module c']);
            expect(b).toBe('module b');
            expect(c).toBe('module c');

            done();
        });
    });


    it('加载器支持alias配置', function() {
        var d = new Loader('dloader');
        d.config('alias', { a: 'module/a' });
        d.config('alias', function(id) {
            if (/^t\./.test(id)) {
                return id.replace(/^t\./, 'test.');
            }
        });

        d.define('module/a', 'module a');
        expect(d.require('a')).toBe('module a');

        d.define('test.a', 'test a');
        expect(d.require('t.a')).toBe('test a');
    });


    it('加载器支持resolve配置', function(done) {
        var x = new Loader('xloader');
        x.config('resolve', function(id) {
            if (/^lang\//.test(id)) {
                return '/butterfly/lib/' + id + '.js';
            }
        });

        x.config('resolve', function(id) {
            if (/^lofty\//.test(id))    {
                return '/' + id + '.js';
            }
        });

        var trigger = x.trigger;
        spyOn(x, 'trigger').and.callFake(function(type, options, fn) {
            if (type !== 'request') {
                return trigger.apply(this, arguments);
            }
            setTimeout(function() {
                x.define(options.id, function() {
                    return options.url;
                });
                fn();
            }, 100);
        });


        x.require(['lang/class', 'lofty/ui/tab'], function(_, tag) {
            expect(_).toBe('/butterfly/lib/lang/class.js');
            expect(tag).toBe('/lofty/ui/tab.js');
            done();
        });
    });


    it('特殊模块的使用: require, module, exports', function(done) {
        var z = new Loader('zloader');
        z.define('a', 'module a');
        z.define('b', ['require', 'exports'], function(require, exports) {
            exports.spec = require('a');
        });
        z.define('c', ['module', 'b'], function(module, b) {
            module.exports = function() {
                return b;
            };
        });

        z.require(['b', 'c'], function(b, c) {
            expect(b.spec).toBe('module a');
            expect(c()).toBe(b);
            done();
        });
    });


    it('匿名模块自动加载', function(done) {
        var g = new Loader('gloader', { autoloadAnonymous: true });
        g.define('a', 'module a');
        g.define('b', ['a'], 'module b');
        g.define(['b', 'a'], function(b, a) {
            expect(b).toBe('module b');
            expect(a).toBe('module a');
            done();
        });
    });


    it('使用加载器其他方法: hasDefine, getModules, resolve', function() {
        var k = new Loader('kloader');

        k.define('a', 'module a');
        k.define('b', 'module b');

        expect(k.hasDefine('a')).toBeTruthy();

        var mods = k.getModules();
        expect(mods['a']).toBeDefined();
        expect(mods['b']).toBeDefined();
    });

});


});
