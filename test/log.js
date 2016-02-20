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


  it('default log level', function() {
    if (process.env.DEBUG === 'xloader') { // eslint-disable-line
      log.level.should.be.equal('debug');
    } else {
      log.level.should.be.equal('warn');
    }
  });


  it('test on log.level=info', function() {
    log.level = 'info';

    log.info('hello');
    log.handler.called.should.be.true();

    log.handler.reset();

    log.warn('world');
    log.handler.called.should.be.true();

    log.handler.reset();

    log.debug('my');
    log.handler.called.should.be.false();

    log.handler.reset();

    log.error('some error');
    log.handler.called.should.be.true();
  });


  it('test on log.level=warn', function() {
    log.level = 'warn';

    log.debug('hello');
    log.handler.called.should.be.false();

    log.handler.reset();

    log.warn('world');
    log.handler.called.should.be.true();

    log.handler.reset();

    log.info('loader');
    log.handler.called.should.be.false();

    log.handler.reset();

    log.error('some error');
    log.handler.called.should.be.true();
  });
});
