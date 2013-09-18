module.exports = function(grunt) {

    grunt.initConfig({
        intern: {
            dev: {
                options: {
                    runType: 'client',
                    config: 'test/config',
                    reporters: ['console', 'lcov'],
                    suites: ['test/all']
                }
            }
        }
    });

    // Load the Intern task
    grunt.loadNpmTasks('intern');

    // Register a test task that uses Intern
    grunt.registerTask('test', ['intern']);

    // By default we just test
    grunt.registerTask('default', ['test']);

};