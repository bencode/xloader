/* global document, butterfly */
butterfly.plugin('mdefine', ['global', 'log', 'assets'],

function(global, log, assets) {


var isIE = document.attachEvent;


/* jshint maxstatements: 25 */
function mdefine(id, depends, factory) {
    // first use default loader to define a module
    var defLoader = global.butterfly;

    if (typeof id !== 'string') {
        // anonymous module
        defLoader.define(id, depends, factory);
        return;
    }

    var defined = false;
    if (!defLoader.hasDefine(id)) {
        defined = true;
        defLoader.define(id, depends, factory);
    }

    var flag = false;
    var fn = function(namespace) {
        var loader = global[namespace];
        loader.define(id, depends, factory);
    };

    if (isIE) {
        var script = assets.getCurrentScript();
        if (script) {
            flag = true;
            var namespace = script.getAttribute('data-butterfly');
            if (namespace && namespace !== 'butterfly') {
                fn(namespace);
                defined && defLoader.undefine(id);
            } else {
                log.error('can not find namespace for ' + id);
            }
        }
    }

    if (!flag) {
        // set hook for module define
        // it will be called when script onload @see assets.js
        assets.postLoadScript = function(url, options) {
            if (id === options.id && options.namespace !== 'butterfly') {
                fn(options.namespace);
                defined && defLoader.undefine(id);
            }
        };
    }
}


// use mdefine for test
global[butterfly.test ? 'mdefine' : 'define'] = mdefine;


});

