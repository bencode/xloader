module.exports = function (grunt) {

var gzip = require('gzip-js');
var pkg = grunt.file.readJSON('package.json');


var slist = [
    'src/butterfly.js',
    'src/util.js',
    'src/log.js',
    'src/event.js',
    'src/config.js',
    'src/define.js',
    'src/require.js',
    'src/assets.js',
    'src/request.js',
    'src/loader.js',
    'src/weave.js'
];



grunt.initConfig({
    pkg: pkg,

    jshint: {
        src: {
            src: 'src',
            options: {
                jshintrc: 'src/.jshintrc'
            }
        }
    },


    compare_size: {
        files: ['dist/butterfly.js', 'dist/butterfly.min.js'],
        options: {
            compress: {
                gz: function(contents) {
                    return gzip.zip(contents, {}).length;
                }
            }
        }
    },


    concat: {
        build: {
            dest: 'dist/butterfly.js',
            src: slist
        }
    },


    uglify: {
        build: {
            src: 'dist/butterfly.js',
            dest: 'dist/butterfly.min.js'
        }
    }
});


grunt.registerTask('replace', function () {
    var data = grunt.file.read('dist/butterfly.js');

    data = data.replace(/@VERSION/g, pkg.version)
        .replace('@DATE', function () {
            // YYYY-MM-DD
            return ( new Date() ).toISOString().replace(/T.*/, '');
        });

    grunt.file.write('dist/butterfly.js', data);
});


// Load grunt tasks from NPM packages
grunt.loadNpmTasks('grunt-cmd-transport');
grunt.loadNpmTasks('grunt-compare-size');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');


// Default grunt
grunt.registerTask('build', ['concat', 'replace', 'jshint', 'uglify', 'compare_size']);
grunt.registerTask('default', ['build']);


};
