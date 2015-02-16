define('request', ['util', 'log', 'assets'], function(util, log, assets) {


var rFile = /\.(css|js)(\?.*)?$/;


return function(loader) {
    var modules = loader.modules;

    this.handle = function(options, callback) {
        var id = options.id;
        var url = options.url;

        var opts = loader.config('requestOptions');
        opts = typeof opts === 'function' ? opts(options) : opts;
        opts = util.extend({ id: id, namespace: options.namespace }, opts);

        opts.success = function() {
            // define a proxy module for just url request
            if (!modules[id] && rFile.test(id)) {
                log.debug('define proxy module for:' + id);
                loader.define(id);
                modules[id].file = true;
            }
            callback();
        };

        opts.error = function() {
            loader.trigger('requesterror', options);
        };

        assets.load(url, opts);
    };
};
//~


});
