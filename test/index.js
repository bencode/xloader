require('../dist/butterfly4node');

butterfly.on('request', function(options, callback) {
    require(options.url);
    callback();
});


global.define = butterfly._define;

require('./butterfly');
require('./util');
require('./log');
require('./event');
require('./config');
require('./define');
require('./require');
require('./loader');
