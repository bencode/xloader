define('test/config', ['config'], function(Config) {

describe('config', function() {
    it('设置和获取配置', function() {
        var config = new Config();

        config.set('root', '/butterfly');
        expect(config.get('root')).toBe('/butterfly');

        expect(config.get('alias')).toEqual([]);

        config.set('alias', { a: 'b' });
        expect(config.get('alias')).toEqual([{ a: 'b' }])

        config.set('alias', { other: 'other'});
        expect(config.get('alias')).toEqual([{ a: 'b' }, { other: 'other' }]);

        expect(config.get('resolve')).toEqual([]);
    });
});


});
