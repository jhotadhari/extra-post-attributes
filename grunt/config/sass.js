'use strict';

const files = [{
	expand: true,
	cwd: 'src/sass',
	src: ['*.scss'],
	dest: '<%= dest_path %>/css',
	ext: '.min.css'
}];
module.exports = {
	options: {
		// require: [
		// 	'susy',
		// 	'breakpoint'
		// ],
		loadPath: [
			require('node-bourbon').includePaths,
		]
	},

	dist: {
		options: {
			sourcemap: 'none',
			style: 'compressed'
		},
		files,
	},

	debug: {
		options: {
			sourcemap: 'auto',
			style: 'expanded',
			lineNumbers: true,
		},
		files,
	}

};