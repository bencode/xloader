'use strict';


const Event = require('../src/event');


describe('event', function() {
  const event = new Event();

  it('支持事件基本操作', function() {
    let s = 0;

    const fn1 = function(n) {
      s += n;
    };

    const fn2 = function(a, b) {
      s *= (a + b);
    };

    event.on('test', fn1);
    event.on('test', fn2);

    event.trigger('test', 3, 4);
    s.should.equal(21);

    event.off('test', fn1);
    event.trigger('test', 5, 2);
    s.should.equal(147);

    event.off('test', fn2);
    event.trigger('test', 3, 6);
    s.should.equal(147);

    // 关闭不存在在的事件也不会报错
    event.off('notexist', fn1);
  });


  it('事件支持返回值, 如果有返回值(非null或非undefined)，则退出事件循环', function() {
    let s = 0;
    event.on('click', function() {
      s += 1;
      return 'hello';
    });
    event.on('click', function() {
      s += 1;
    });

    const ret = event.trigger('click');
    ret.should.equal('hello');
    s.should.equal(1);
  });


  it('让普通对象有事件能力', function() {
    const o = {
      set: function(name, value) {
        this[name] = value;
        this.trigger('set', name, value);
      }
    };

    new Event(o);  // eslint-disable-line

    let data = null;

    o.on('set', function(name, value) {
      this.dirty = true;
      data = [name, value];
    });

    o.set('version', '2.3');

    o.version.should.equal('2.3');
    o.dirty.should.true();

    data.should.eql(['version', '2.3']);
  });
});
