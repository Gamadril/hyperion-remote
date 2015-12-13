module.exports = function (grunt) {

    grunt.initConfig({
        clean: [
            'build',
            'out/browser',
            'out/chrome',
            'out/firefoxos'
        ],
        jshint: {
            files: [
                'src/**/*.js',
                '!src/js/vendor/*.js'
            ],
            options: {
                nonew: true,
                nomen: true,
                curly: true,
                latedef: true,
                unused: 'vars',
                noarg: true,
                forin: true,
                noempty: true,
                quotmark: 'single',
                eqeqeq: true,
                strict: true,
                undef: true,
                bitwise: true,
                onevar: true,
                browser: true,
                devel: true,
                nonbsp: true,
                freeze: true,
                globals: {
                    console: true,
                    document: true,
                    define: true
                }
            }
        },
        requirejs: {
            chrome: {
                options: {
                    appDir: "src/",
                    baseUrl: "js/app",
                    dir: "build/chrome",
                    force: true,
                    paths: {
                        'lib': '../vendor'
                    },
                    optimize: 'uglify',
                    modules: [
                        {
                            name: 'main_chrome'
                        }
                    ],
                    map: {
                        'controllers/AppController': {
                            'api/Socket': 'api/ChromeTcpSocket',
                            'api/Network': 'api/ChromeNetwork'
                        },
                        'models/Settings': {
                            'api/LocalStorage': 'api/ChromeLocalStorage'
                        }
                    },
                    onBuildWrite: function (moduleName, path, contents) {
                        return contents.replace(/console.log(.*);/g, '');
                    }
                }
            },
            browser: {
                options: {
                    appDir: "src/",
                    baseUrl: "js/app",
                    dir: "build/browser",
                    force: true,
                    paths: {
                        'lib': '../vendor'
                    },
                    optimize: 'uglify',
                    modules: [
                        {
                            name: 'main'
                        }
                    ],
                    map: {
                        'controllers/AppController': {
                            'api/Socket': 'api/WebSocket'
                        }
                    },
                    onBuildWrite: function (moduleName, path, contents) {
                        return contents.replace(/console.log(.*);/g, '');
                    }
                }
            },
            firefoxos: {
                options: {
                    appDir: "src/",
                    baseUrl: "js/app",
                    dir: "build/firefoxos",
                    force: true,
                    paths: {
                        'lib': '../vendor'
                    },
                    optimize: 'uglify',
                    modules: [
                        {
                            name: 'main'
                        }
                    ],
                    map: {
                        'controllers/AppController': {
                            'api/Socket': 'api/WebSocket'
                        }
                    },
                    onBuildWrite: function (moduleName, path, contents) {
                        return contents.replace(/console.log(.*);/g, '');
                    }
                }
            },
            css_chrome: {
                options: {
                    optimizeCss: 'standard',
                    cssIn: 'src/css/index.css',
                    out: 'build/chrome/css/index.css'
                }
            },
            css_browser: {
                options: {
                    optimizeCss: 'standard',
                    cssIn: 'src/css/index.css',
                    out: 'build/browser/css/index.css'
                }
            },
            css_firefoxos: {
                options: {
                    optimizeCss: 'standard',
                    cssIn: 'src/css/index.css',
                    out: 'build/firefoxos/css/index.css'
                }
            }
        },
        copy: {
            chrome: {
                cwd: 'build/chrome',
                src: [
                    'index.html',
                    'res/*',
                    'css/index.css',
                    'manifest.json',
                    'js/background.js',
                    'js/vendor/require.js'
                ],
                dest: 'out/chrome/',
                expand: true
            },
            browser: {
                cwd: 'build/browser',
                src: [
                    'index.html',
                    'res/fontello.*',
                    'res/colorwheel.png',
                    'res/icon_128.png',
                    'css/index.css',
                    'js/app/main.js',
                    'js/vendor/require.js'
                ],
                dest: 'out/browser/',
                expand: true
            },
            firefoxos: {
                cwd: 'build/firefoxos',
                src: [
                    'index.html',
                    'res/fontello.*',
                    'manifest.webapp',
                    'res/colorwheel.png',
                    'res/icon_128.png',
                    'css/index.css',
                    'js/app/main.js',
                    'js/vendor/require.js'
                ],
                dest: 'out/firefoxos/',
                expand: true
            },
            chrome_main: {
                src: 'build/chrome/js/app/main_chrome.js',
                dest: 'out/chrome/js/app/main.js'
            },
            browser_main: {
                src: 'build/browser/js/app/main.js',
                dest: 'out/browser/js/app/main.js'
            },
            firefoxos_main: {
                src: 'build/firefoxos/js/app/main.js',
                dest: 'out/firefoxos/js/app/main.js'
            }
        },
        compress: {
            chrome: {
                options: {
                    archive: 'out/chrome/hyperion-remote.zip'
                },
                files: [
                    {
                        src: ['index.html'],
                        expand: true,
                        cwd: 'out/chrome'
                    },
                    {
                        src: ['manifest.json'],
                        expand: true,
                        cwd: 'out/chrome'
                    },
                    {
                        src: ['res/*'],
                        expand: true,
                        cwd: 'out/chrome'
                    },
                    {
                        src: ['res/icon_128.png'],
                        dest: '/',
                        expand: true,
                        cwd: 'out/chrome',
                        flatten: true
                    },
                    {
                        src: ['css/index.css'],
                        expand: true,
                        cwd: 'out/chrome'
                    },
                    {
                        src: ['js/app/main.js'],
                        expand: true,
                        cwd: 'out/chrome'
                    },
                    {
                        src: ['js/background.js'],
                        expand: true,
                        cwd: 'out/chrome'
                    },
                    {
                        src: ['js/vendor/require.js'],
                        expand: true,
                        cwd: 'out/chrome'
                    }
                ]
            }
        },
        appcache: {
            options: {
                basePath: 'out/firefoxos'
            },
            all: {
                dest: 'out/firefoxos/manifest.appcache',
                cache: 'out/firefoxos/**/*'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cordovacli');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-appcache');

    grunt.registerTask('fixmanifest', function () {
        var manifestFile = 'out/chrome/manifest.json';
        var manifest = grunt.file.readJSON(manifestFile);
        manifest.icons['128'] = 'icon_128.png';
        grunt.file.write(manifestFile, JSON.stringify(manifest, null, 2));
    });

    grunt.registerTask('copy-chrometest', function () {
        grunt.file.recurse('src', function (abspath, rootdir, subdir, filename) {
            var outpath = 'out/chrome/';

            if ((subdir && subdir.charAt(0) === '.') || filename.charAt(0) === '.') {
                return;
            }

            if (subdir) {
                outpath = outpath + subdir + '/';
            }

            outpath += filename;

            grunt.file.copy(abspath, outpath);
        });
        grunt.file.copy('src/js/app/main_chrome.js', './out/chrome/js/app/main.js');
        grunt.file.copy('./out/chrome/res/icon_128.png', './out/chrome/icon_128.png');
    });

    grunt.registerTask('default', [
        'clean',
        'jshint',
        'requirejs',
        'copy',
        'fixmanifest',
        'compress'
    ]);
    grunt.registerTask('firefoxos', [
        'clean',
        'jshint',
        'requirejs',
        'copy',
        'appcache'
    ]);
    grunt.registerTask('chrome-test', [
        'clean',
        'copy-chrometest'
    ]);
};
