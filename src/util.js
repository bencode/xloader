define('util', function() {


var toString = Object.prototype.toString;
var guid = 1;


var exports = {

    isArray: Array.isArray ? Array.isArray : function(o) {
        return toString.call(o) === '[object Array]';
    },


    extend: function(des, src) {
        for (var k in src) {
            var v = src[k];
            if (v !== null && v !== undefined) {
                des[k] = v;
            }
        }
        return des;
    },


    each: function(iter, fn) {
        var len = iter.length;
        var isArrayLike = len === 0 ||
                (typeof len === 'number' && len > 0 && (len - 1) in iter);

        if (isArrayLike) {
            for (var i = 0; i < len; i++) {
                if (fn(i, iter[i]) === false) {
                    break;
                }
            }
        } else {
            for (var k in iter) {
                if (fn(k, iter[k]) === false) {
                    break;
                }
            }
        }
    },


    map: function(list, fn) {
        var ret = [];
        for (var i = 0, c = list.length; i < c; i++) {
            var v = fn(i, list[i]);
            v !== undefined && ret.push(v);
        }
        return ret;
    },


    proxy: function(o, name) {
        var fn = o[name];
        return function() {
            return fn.apply(o, arguments);
        };
    },


    assert: function(test, message) {
        if (!test) {
            throw new Error('AssertFailError: ' + message);
        }
    },


    guid: function() {
        return guid++;
    },


    when: function(works, fn) {
        var results = [];
        var n = works.length;
        var count = 0;

        var check = function() {
            count >= n && fn(results);
        };

        check();
        exports.each(works, function(index, work) {
            work(function(ret) {
                results[index] = ret;
                count++;
                check();
            });
        });
    }
};


return exports;


});
