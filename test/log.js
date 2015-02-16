define('test/log', ['log', 'global'], function(log, global) {

describe('log', function() {

    var loc = global.location,
        level = loc && (/\bdebug-log-level=(\w+)/.exec(loc.search) || {})[1] || 'error';

    afterEach(function() {
        log.level = level;
    });

    it('可以通过url参数 debug-log-level设置日志级别', function() {
        expect(log.level).toBe(level);
    });


    it('log.level=info时, log.info有输出', function() {
        log.level = 'info';

        spyOn(log, 'handler');
        log.info('hello');
        expect(log.handler).toHaveBeenCalled();
    });


    it('log.level=error时, log.info不输出', function() {
        log.level = 'error';

        spyOn(log, 'handler');
        log.info('hello');

        expect(log.handler).not.toHaveBeenCalled();
    });

});


});
