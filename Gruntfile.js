module.exports = function(grunt) {
	
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		jshint: {
			all: ['src/js/*.js']
		},
		
		concat: {
			js: {
				src: ['src/js/poimap.js', 'src/js/poilist.js','src/js/mapsapp.js', 'src/js/*.js'],
				dest: 'src/concat/js/concat_scripts.js'
			},
			css: {
				src: 'src/css/*.css',
				dest: 'src/concat/css/concat_css.css'
			}
		},
		
		uglify: {
			my_target: {
				files: {
					'dist/js/<%= pkg.name %>.min.js': ['src/concat/js/concat_scripts.js']
				}
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
		
		bower_concat: {
			all: {
				dest: 'dist/js/_bower.js',
				cssDest: 'dist/css/_bower.css'
			}
		},
		
		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			html: {
				files: ['dist/*.html'],
				tasks: ['javascript', 'css']
			},
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['javascript']
			},
			css: {
				files: ['src/sass/*.scss'],
				tasks: ['css']
			}
		}

	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-bower-concat');

	grunt.registerTask('javascript', ['jshint', 'concat', 'uglify']);
	grunt.registerTask('css', ['sass', 'concat:css', 'cssmin']);
	
	grunt.registerTask('default', ['connect', 'bower_concat', 'javascript', 'css', 'watch']);
	
};