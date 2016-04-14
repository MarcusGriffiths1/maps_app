module.exports = function(grunt) {
	
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		jshint: {
			all: ['src/js/*.js']
		},
		
		concat: {
			options: {
				separator: '// ----------------------------------'
			},
			js: {
				src: 'src/js/*.js',
				dest: 'src/js/concat/concat_scripts.js'
			}
		},
		
		uglify: {
			my_target: {
				files: {
					'dist/js/<%= pkg.name %>.min.js': ['src/js/concat/concat_scripts.js']
				}
			}
		},
		
		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['javascript']
			},
			css: {
				files: ['src/sass/*.scss'],
				tasks: ['sass', 'cssmin']
			}
		}

	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('javascript', ['jshint', 'concat:js', 'uglify']);
	grunt.registerTask('css', ['sass', 'concat:css', 'cssmin']);
	
	grunt.registerTask('default', ['javascript', 'css', 'watch']);
	
};