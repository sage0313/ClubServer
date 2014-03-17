
'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				node: true,
				es5: true,
				globals: {'describe' : false, 'it' : false, 'beforeEach':false, 'afterEach':false, 'expect' : false, 'waitsFor' : false, 'runs' : false, 'xit' : false, 'xdescribe' : false}
			},
			all: ['app.js', 'services/**/*.js', 'message/**/*.js', 'routes/**/*.js', 'utils/**/*.js', 'spec/**/*.js']
		},
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
};
