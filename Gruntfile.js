module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {
			css: {
				src: 'src/css/*.css',
				dest: 'src/concat/css/concat_css.css'
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'src/css/styles.css': ['src/sass/main.scss']
				}
			}
		},

		cssmin: {
			target: {
				files: {
					'dist/css/styles.css': 'src/concat/css/concat_css.css'
				}
			}
		},

		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: 3000,
					base: 'dist/',
					livereload: true
				}
			}
		},

		browserify: {
			dist: {
				options: {
					transform: [['babelify', {presets: ["es2015"]}]]
				},
				files: {
					"./dist/js/maps_app.js": ["./src/js/index.js"]
				}
			}
		},

		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			html: {
				files: ['dist/*.html'],
				tasks: ['browserify', 'css']
			},
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['browserify']
			},
			css: {
				files: ['src/sass/*.scss'],
				tasks: ['css']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	// grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-browserify');

	// grunt.registerTask('javascript', ['jshint', 'concat', 'uglify']);
	grunt.registerTask('css', ['sass', 'concat:css', 'cssmin']);

	grunt.registerTask('default', ['connect', /*'javascript',*/ 'css', 'browserify', 'watch']);

};
