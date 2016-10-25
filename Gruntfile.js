module.exports = grunt => {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        watch: {
            scripts: {
                files: [
                    'app/*.pug', 'app/*.json'
                ],
                tasks: ['pug'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['app/style/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['app/js/*.js'],
                tasks: ['uglify:jsMy'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            js: {
                options:{
                    sourceMap: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/js',
                        src: '*.js',
                        dest: 'dist/js'
                    }
                ]
            },
            jsMy: {
                options:{
                    sourceMap: true,
                },
                files: {
                    'dist/js/app.js' : ['app/js/app.js'],
                    'dist/js/ngapp.js' : ['app/js/ngapp.js']
                }
            }
        },
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'dist/style/main.css': 'app/style/main.scss'
                }
            }
        },
        pug: {
            compile: {
                files: {
                    'dist/index.html': ['app/index.pug'],
                    'dist/test.html': ['app/test.pug']
                }
            }
        }
    });
    grunt.registerTask('default', ['watch']);
};
