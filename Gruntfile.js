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
            }
        },

        cssmin: {
            minify: {
                files: [{
                    'public/static/css/styles.min.css': ['public/static/css/styles.css']
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('default', ['watch']);

}