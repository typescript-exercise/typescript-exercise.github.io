module.exports = function(grunt) {
    // config
    grunt.initConfig({
        connect: {
            build: {
                options: {
                    port: 8123,
                    hostname: 'localhost',
                    open: 'http://<%=connect.build.options.hostname%>:<%=connect.build.options.port%>/'
                }
            }
        },
        watch: {
            build: {
                files: 'index.html',
                options: {
                    livereload: true
                }
            }
        }
    });

    // plugin
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // tasks
    grunt.registerTask('default', ['connect', 'watch']);
};
