'use strict';


const x = require('..');


describe('index', function() {
  it('define a group of functions', function() {
    const methods = [
      'new',
      'config',

      'on',
      'off',

      'define',
      'require',
      'hasDefine',
      'getModules',
      'resolve',
      'undefine'
    ];

    for (const name of methods) {
      x[name].should.be.type('function');
    }
  });


  it('define global module', function() {
    x.require('global').should.equal(global);
  });
});
