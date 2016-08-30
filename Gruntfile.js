module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: [
				'/**',
				' * <%= pkg.description %>',
				' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
				' * @link <%= pkg.homepage %>',
				' * @author <%= pkg.author %>',
				' * @license MIT License, http://www.opensource.org/licenses/MIT',
				' */'
			].join('\n')
		},
		dirs: { dest: 'dist' },
		concat: {
			options: {
				banner: '<%= meta.banner %>' + '\n' +
				'(function (window, angular) {\n',
				footer: '})(window, window.angular);'
			},
			dist: {
				src: ['src/angular-communicator.js'],
				dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= meta.banner %>',
				sourceMap: true
			},
			dist: {
				src: ['<%= concat.dist.dest %>'],
				dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
			}
		},
		karma: {
			options: {
				autowatch: true,
				configFile: 'test/karma.conf.js'
			},
			unit: {}
		},
		jshint: {
			grunt: {
				src: ['Gruntfile.js'],
				options: { node: true }
			},
			dev: {
				src: ['angular-communicator.js'],
				options: {}
			},
			test: {
				src: ['test/spec/**/*.js'],
				options: { jshintrc: 'test/.jshintrc' }
			}
		}
	});

	grunt.registerTask('test', [
    'dist',
		'concat',
		'karma'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test'
	]);

	grunt.registerTask('dist', [
		'concat',
		'uglify'
	]);
};
