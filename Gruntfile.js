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
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'app/js/vendors/angular.js',
                    'app/js/vendors/FileSaver.js',
                    'app/js/vendors/jquery.js',
                    'app/js/vendors/materialize.js',
                ],
                dest: 'app/js/vendors.js'
            }
        },
        uglify: {
            vendor: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/js/vendors.js': ['app/js/vendors.js'],
                    'dist/js/browser-id3-writer.min.js': ['app/js/vendors/browser-id3-writer.min.js'],
                    'dist/js/id3-minimized.js': ['app/js/vendors/id3-minimized.js']
                }
            },
            jsMy: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/js/ngapp.js': ['app/js/ngapp.js']
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
                }
            }
        }
    });
    grunt.registerTask('default', ['watch']);
};
