'use strict';


const sinon = require('sinon');
const log = require('../src/log');


/* global beforeEach, afterEach */


describe('log', function() {
  beforeEach(function() {
    this.lastLevel = log.level;
    sinon.spy(log, 'handler');
  });


  afterEach(function() {
    log.level = this.lastLevel;
    log.handler.restore();
  });


  it('默认log level为error', function() {
    log.level.should.be.equal('error');
  });


  it('log.level=info时, log.info有输出', function() {
    log.level = 'info';

    log.info('hello');
    log.handler.called.should.be.true();
  });


  it('log.level=error时, log.info不输出', function() {
    log.level = 'info';

    log.debug('hello');

    log.handler.called.should.be.false();
  });
});
