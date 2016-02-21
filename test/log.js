'use strict';


const sinon = require('sinon');
const log = require('../src/log');


/* global beforeEach, afterEach */


describe('log', function() {
  beforeEach(function() {
    this.lastLevel = log.level;
    this.lastFilter = log.filter;
    sinon.spy(log, 'handler');
  });


  afterEach(function() {
    log.level = this.lastLevel;
    log.filter = this.lastFilter;
    log.handler.restore();
  });


  it('test on log.level=info', function() {
    log.level = 'info';
    log.filter = false;

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
    log.filter = false;

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
