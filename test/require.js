define('test/require', ['event', 'define', 'require'], function(Event, Define, Require) {


describe('require', function() {
    var loader = { modules: {} };
    new Event(loader);

    var d = new Define(loader);
    var r = new Require(loader);


    it('使用require载入已定义的模块', function(done) {
        d.define('a', ['b', 'c'], function(b, c) {
            return [b, c];
        });

        d.define('b', 'module b');
        d.define('c', 'module c');

        r.require(['a'], function(a) {
            expect(a).toEqual(['module b', 'module c']);
            done();
        });
    });


    it('使用require载入异步模块', function(done) {
        spyOn(loader, 'trigger').and.callFake(function(type, id, fn) {
            if (type === 'alias') {
                return 'test/' + id;
            }

            if (type === 'resolve') {
                return 'resolve/' + id;
            }

            if (type === 'request') {
                var options = id;
                d.define(options.id, function() {
                    return options.url; 
                });
                fn();
            }
        });


        r.require(['e'], function(e) {
            expect(e).toBe('resolve/test/e');
            done();
        });
    });


    it('介入compile流程', function() {
        loader.on('compile', function(module) {
            if (module.factory === 'a') {
                module.factory = 'b';
            }
        });

        d.define('compile/a', 'a');
        r.require(['compile/a'], function(a) {
            expect(a).toBe('b');
        });
    });

});


});
