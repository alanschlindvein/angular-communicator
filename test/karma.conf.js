// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	'use strict';

	var bower = 'test/lib/bower_components/';

	config.set({
		autoWatch: true,
		basePath: '../',
		browsers: ['PhantomJS'],
		files: [
			bower + 'angular/angular.js',
			bower + 'angular-mocks/angular-mocks.js',
			'dist/angular-communicator.js',
			'test/spec/**/*.js'
		],
		frameworks: ['jasmine'],
		plugins: [
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-coverage'
		],
		logLevel: config.LOG_INFO,
		port: 8999,
		singleRun: true,
		reporters: ['progress', 'coverage'],
		preprocessors: { 'src/*.js': ['coverage'] },
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};
