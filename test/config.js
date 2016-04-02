'use strict';


const Config = require('../lib/config');


describe('config', function() {
  it('设置和获取配置', function() {
    const config = new Config();

    config.set('root', '/xloader');
    config.get('root').should.equal('/xloader');

    config.get('alias').should.eql([]);

    config.set('alias', { a: 'b' });
    config.get('alias').should.eql([{ a: 'b' }]);

    config.set('alias', { other: 'other' });
    config.get('alias').should.eql([{ a: 'b' }, { other: 'other' }]);

    config.get('resolve').should.eql([]);
  });
});
