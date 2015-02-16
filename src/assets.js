/* jshint browser: true */
/* jshint maxstatements: 25 */

define('assets', ['log'], function(log) {


var rCss = /\.css(\?|$)/;

var exports = {};

exports.postLoadScript = null;


exports.load = function(url, options) {
    var type = rCss.test(url) ? 'css' : 'script';
    return exports[type](url, options);
};


var currentlyAddingScript;

exports.script = function(url, options) {
    log.debug('request script: ' + url);

    options = options || {};

    var node = doc.createElement('script');
    var removeNode = !log.isEnabled('debug');

    onLoadAssets(node, url, removeNode, options, function() {
        if (exports.postLoadScript) {
            exports.postLoadScript(url, options);
            exports.postLoadScript = null;
        }
    });

    node.async = 'async';
    if (options.namespace) {
        node.setAttribute('data-butterfly', options.namespace);
    }
    node.src = url;

    if (options.charset) {
        node.charset = options.charset;
    }

    currentlyAddingScript = node;
    append(node);
    currentlyAddingScript = null;
};
//~ script





var rWebKit = /.*webkit\/?(\d+)\..*/;
var rMobile = /mobile/;

var UA = window.navigator.userAgent.toLowerCase();
var webkitVersion = rWebKit.exec(UA);
var isOldWebKit = webkitVersion ? webkitVersion[1] * 1 < 536 : false;
var isPollCSS = isOldWebKit || (!webkitVersion && rMobile.test(UA));


exports.css = function(url, options) {
    log.debug('request css: ' + url);

    options = options || {};

    var node = doc.createElement('link');

    node.rel = 'stylesheet';
    node.href = url;

    if (options.charset) {
        node.charset = options.charset;
    }

    if (!('onload' in node) || isPollCSS) {
        setTimeout(function() {
            poll(node, options);
        }, 1);
    } else {
        onLoadAssets(node, url, false, options);
    }

    append(node);
};
//~ css


var rLoadSheetError = /security|denied/i;
function poll(node, options) {
    var flag = false;

    setTimeout(function() {
        if (!flag) {
            flag = true;
            options.error && options.error();
        }
    }, options.timeout || 10000);

    var fn = function() {
        var isLoaded = false;
        try {
            isLoaded = !!node.sheet;
        } catch (e) {
            isLoaded = rLoadSheetError.test(e.message);
        }

        if (!flag) {
            if (isLoaded) {
                flag = true;
                options.success && options.success();
            } else {
                setTimeout(fn, 20);
            }
        }
    };

    fn();
}


var rReadyStates = /loaded|complete|undefined/;
/* jshint maxparams:5 */
function onLoadAssets(node, url, removeNode, options, fn) {
    node.onload = node.onreadystatechange = function(event) {
        event = event || window.event || {};
        if (event.type === 'load' || rReadyStates.test('' + node.readyState)) {
            node.onload = node.onreadystatechange = node.onerror = null;
            removeNode && head.removeChild(node);
            log.debug('load success: ' + url);
            fn && fn();
            options.success && options.success();
        }
    };

    node.onerror = function() {
        node.onload = node.onreadystatechange = node.onerror = null;
        log.error('load error: ' + url);
        options.error && options.error();
    };
}


var doc = document;
var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
var baseElement = doc.getElementsByTagName('base')[0];

function append(node) {
    baseElement ? head.insertBefore(node, baseElement) :
            head.appendChild(node);
}


// from seajs
var interactiveScript;

exports.getCurrentScript = function() {
    if (currentlyAddingScript) {
        return currentlyAddingScript;
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === 'interactive') {
        return interactiveScript;
    }

    var scripts = head.getElementsByTagName('script');

    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.readyState === 'interactive') {
            interactiveScript = script;
            return interactiveScript;
        }
    }
};


return exports;


});
