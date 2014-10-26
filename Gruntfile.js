module.exports = function(grunt) {

	grunt.initConfig({
		clean: ['build', 'out/browser', 'out/chrome', 'out/cordova/www', 'out/cordova/platforms/ios/build', 'out/cordova/platforms/ios/CordovaLib/build', 'out/cordova/platforms/ios/www'],
		jshint: {
			files: ['src/**/*.js', '!src/js/vendor/*.js'],
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
					modules: [{
						name: 'main_chrome'
					}],
				    map: {
				        'controllers/AppController': {
				            'api/Socket': 'api/ChromeTcpSocket',
				            'api/Network': 'api/ChromeNetwork'
				        },
				        'models/Settings': {
				            'api/LocalStorage': 'api/ChromeLocalStorage'
				        }
				    },
					onBuildWrite: function(moduleName, path, contents) {
						return contents.replace(/console.log(.*);/g, '');
					}
				}
			},
			cordova: {
				options: {
					appDir: "src/",
					baseUrl: "js/app",
					dir: 'build/cordova',
					force: true,
					paths: {
						'lib': '../vendor'
					},
					optimize: 'uglify',
					modules: [{
						name: 'main_cordova'
					}],
				    map: {
				        'controllers/AppController': {
				            'api/Socket': 'api/CordovaTcpSocket',
				            'api/Network': 'api/CordovaNetwork'
				        }
				    },
					onBuildWrite: function(moduleName, path, contents) {
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
					modules: [{
						name: 'main'
					}],
				    map: {
				        'controllers/AppController': {
				            'api/Socket': 'api/WebSocket'
				        }
				    },
					onBuildWrite: function(moduleName, path, contents) {
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
			css_cordova: {
				options: {
					optimizeCss: 'standard',
					cssIn: 'src/css/index.css',
					out: 'build/cordova/css/index.css'
				}
			},
			css_browser: {
				options: {
					optimizeCss: 'standard',
					cssIn: 'src/css/index.css',
					out: 'build/browser/css/index.css'
				}
			}
		},
		copy: {
			chrome: {
				cwd: 'build/chrome',
				src: ['index.html', 'res/*', 'css/index.css', 'manifest.json', 'js/background.js', 'js/vendor/require.js'],
				dest: 'out/chrome/',
				expand: true
			},
			cordova: {
				cwd: 'build/cordova',
				src: ['index.html', 'res/*', 'css/index.css', 'js/vendor/require.js'],
				dest: 'out/cordova/www',
				expand: true
			},
			browser: {
				cwd: 'build/chrome',
				src: ['index.html', 'res/fontello.*', 'res/colorwheel.png', 'css/index.css', 'js/app/main.js', 'js/vendor/require.js'],
				dest: 'out/browser/',
				expand: true				
			},
			cordova_main: {
				src: 'build/cordova/js/app/main_cordova.js',
				dest: 'out/cordova/www/js/app/main.js'
			},
			chrome_main: {
				src: 'build/chrome/js/app/main_chrome.js',
				dest: 'out/chrome/js/app/main.js'
			},
			browser_main: {
				src: 'build/browser/js/app/main.js',
				dest: 'out/browser/js/app/main.js'
			}
		},
		cordovacli: {
			options: {
				path: 'out/cordova'
			},
			build_ios: {
				options: {
					command: 'build',
					platforms: ['ios']
				}
			}
		},
		compress: {
			chrome: {
				options: {
					archive: 'out/chrome/hyperion-remote.zip'
				},
				files: [{
					src: ['index.html'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['manifest.json'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['res/*'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['res/icon_128.png'],
					dest: '/',
					expand: true,
					cwd: 'out/chrome',
					flatten: true
				}, {
					src: ['css/index.css'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['js/app/main.js'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['js/background.js'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['cordova.js'],
					expand: true,
					cwd: 'out/chrome'
				}, {
					src: ['js/vendor/require.js'],
					expand: true,
					cwd: 'out/chrome'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cordovacli');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('fixmanifest', function() {
		var manifestFile = 'out/chrome/manifest.json';
		var manifest = grunt.file.readJSON(manifestFile);
		manifest.icons['128'] = 'icon_128.png';
		grunt.file.write(manifestFile, JSON.stringify(manifest, null, 2));
	});

	grunt.registerTask('copy-iostest', function() {
		grunt.file.recurse('src', function(abspath, rootdir, subdir, filename) {
			var outpath = 'out/cordova/www/';

			if ((subdir && subdir.charAt(0) === '.') || filename.charAt(0) === '.') {
				return;
			}

			if (subdir) {
				outpath = outpath + subdir + '/';
			}

			outpath += filename;

			grunt.file.copy(abspath, outpath);
		});
		grunt.file.copy('src/js/app/main_cordova.js', './out/cordova/www/js/app/main.js');
	});

	grunt.registerTask('copy-chrometest', function() {
		grunt.file.recurse('src', function(abspath, rootdir, subdir, filename) {
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

	grunt.registerTask('default', ['clean', 'jshint', 'requirejs', 'copy', 'cordovacli', 'fixmanifest', 'compress']);
	grunt.registerTask('ios-test', ['clean', 'copy-iostest', 'cordovacli']);
	grunt.registerTask('chrome-test', ['clean', 'copy-chrometest']);
};
