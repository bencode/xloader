define('test/event', ['event'], function(Event) {

describe('event', function() {

    var event = new Event();

    it('支持事件基本操作', function() {
        var s = 0;

        var fn1 = function(n) {
            s += n;
        };

        var fn2 = function(a, b) {
            s *= (a + b);
        };

        event.on('test', fn1);
        event.on('test', fn2);

        event.trigger('test', 3, 4);
        expect(s).toBe(21);

        event.off('test', fn1);
        event.trigger('test', 5, 2);
        expect(s).toBe(147);
    });


    it('事件支持返回值, 如果有返回值(非null或非undefined)，则退出事件循环', function() {
        var s = 0;
        event.on('click', function() {
            s += 1;
            return 'hello';
        });
        event.on('click', function() {
            s +=1;
        });

        var ret = event.trigger('click');
        expect(ret).toBe('hello');
        expect(s).toBe(1);
    });


    it('让普通对象有事件能力', function() {
        var o = {
            set: function(name, value) {
                this[name] = value;
                this.trigger('set', name, value);
            }
        };

        new Event(o);

        var data = null;

        o.on('set', function(name, value) {
            this.dirty = true;
            data = [name, value];
        });

        o.set('version', '2.3');

        expect(o.version).toBe('2.3');
        expect(o.dirty).toBeTruthy();

        expect(data).toEqual(['version', '2.3']);
    });


});


});
