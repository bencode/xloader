'use strict';


const Config = require('../src/config');


describe('config', function() {
  it('设置和获取配置', function() {
    const config = new Config();

    config.set('root', '/xloader');
    config.get('root').should.be.equal('/xloader');

    config.get('alias').should.be.eql([]);

    config.set('alias', { a: 'b' });
    config.get('alias').should.be.eql([{ a: 'b' }]);

    config.set('alias', { other: 'other' });
    config.get('alias').should.be.eql([{ a: 'b' }, { other: 'other' }]);

    config.get('resolve').should.be.eql([]);
  });
});
