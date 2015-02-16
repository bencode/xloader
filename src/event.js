define('event', ['util', 'log'], function(util, log) {


var slice = [].slice;


return function(target) {
    var cache = {};

    target = target || {};

    target.on = function(name, fn) {
        log.debug('event.on:' + name);
        var list = cache[name] || (cache[name] = []);
        list.push(fn);
    };


    target.trigger = function(name) {
        log.debug('event.trigger:' + name);

        var list = cache[name];
        if (list) {
            var params = arguments.length > 1 ? slice.call(arguments, 1) : [];
            for (var i = 0, c = list.length; i < c; i++) {
                var result = list[i].apply(target, params);
                if (result !== null && result !== undefined) {
                    return result;
                }
            }
        }
    };


    target.off = function(name, fn) {
        log.debug('event.off:' + name);

        var list = cache[name];
        if (list) {
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i] === fn) {
                    list.splice(i, 1);
                }
            }
            if (!list.length) {
                delete cache[name];
            }
        }
    };


    return target;
};
//~


});
