'use strict';


const util = require('./util');


module.exports = function(proto) {
  const klass = function() {
    const init = this.init;
    return init && init.apply(this, arguments);
  };

  proto && util.extend(klass.prototype, proto);

  return klass;
};
