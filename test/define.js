define('test/define', ['define'], function(Define) {

describe('define', function() {

    var loader = { modules: {}, trigger: function() {} };
    var mods = loader.modules;
    var x = new Define(loader);
    var fn = function() {};


    it('define(id, depends, factory)', function() {
        x.define('a', ['b', 'c', 'd'], fn);
        expect(mods.a).toEqual({
            id: 'a',
            depends: ['b', 'c', 'd'],
            factory: fn,
            anonymous: false
        });
    });


    it('define(id, factory)', function() {
        x.define('b', fn);
        expect(mods.b).toEqual({
            id: 'b',
            depends: [],
            factory: fn,
            anonymous: false
        });
    });


    it('define(a, depends)', function() {
        x.define('c', ['b', 'c', 'd']);
        expect(mods.c).toEqual({
            id: 'c',
            depends: ['b', 'c', 'd'],
            factory: undefined,
            anonymous: false
        });
    });


    it('define(depends, factory)', function() {
        var o = x.define(['b', 'c', 'd'], fn);
        expect(/^____anonymous\d+$/.test(o.id)).toBeTruthy();
        expect(o.anonymous).toBeTruthy();
    });


    it('define(fn)', function() {
        var o = x.define(fn);
        expect(o.factory).toBe(fn);
        expect(o.anonymous).toBeTruthy();
    });


    it('可以响应define事件', function() {
        spyOn(loader, 'trigger');

        x.define('test/a', ['a', 'b'], function() {});
        var o = mods['test/a'];

        expect(loader.trigger).toHaveBeenCalledWith('define', o);
    });

});


});
