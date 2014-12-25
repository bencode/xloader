define('config', function() {

var listFields = { alias: true, resolve: true };

return function() {
    var cache = {};

    this.get = function(name) {
        return listFields[name] ? (cache[name] || []) : cache[name];
    };

    this.set = function(name, value) {
        if (listFields[name]) {
            cache[name] = cache[name] || [];
            cache[name].push(value);
        } else {
            cache[name] = value;
        }
    };
};
//~


});

