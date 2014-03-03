module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),


        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['compass']
            },

            browserify: {
                files: 'src/**/*.js',
                tasks: ['browserify']
            }
        },

        cssmin: {
            minify: {
                files: [{
                    'public/static/css/styles.min.css': ['public/static/css/styles.css']
                }]
            }
        },

        browserify: {
            dist: {
                files: {
                    'public/static/js//bighak.js': ['src/main.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify', 'watch']);

}
