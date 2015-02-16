define('weave', ['global', 'origindefine', 'util', 'loader'],
        function(global, origindefine, util, Loader) {

var butterfly = function(namespace, options) {
    var o = new Loader(namespace, options);
    butterfly._modules[namespace] = o.modules;
    return o;
};


// save loader define
var _define = define;


// for test and debug
butterfly._define = _define;
butterfly._modules = {};

// for plugin
butterfly.plugin = function(name, depends, factory) {
    _define('plugin/' + name, depends, factory);
};


var loader = butterfly('butterfly', { autoloadAnonymous: true });


var methods = ['config', 'on', 'off', 'define', 'require',
        'hasDefine', 'getModules', 'resolve', 'undefine'];

util.each(methods, function(index, name) {
    butterfly[name] = loader[name];
});


butterfly.define('global', function() {
    return global;
});


var _butterfly = global.butterfly;

global.butterfly = butterfly;
global.define = butterfly.define;

butterfly.noConflict = function() {
    global.define = origindefine;
    global.butterfly = _butterfly;
    return butterfly;
};


});
