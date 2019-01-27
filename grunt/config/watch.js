module.exports = {
	// watch task does the same like build...

	root_files: {
		files: [
			'src/root_files/**/*',
			'!src/root_files/<%= global["pkg"].name %>.php',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'copy:root_files',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},

	plugin_main_file: {
		files: [
			'src/root_files/<%= global["pkg"].name %>.php',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'string-replace:plugin_main_file',	// copies plugin_main_file to destination
			'concat:plugin_main_file',		// add banner plugin_main_file
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},





	vendor: {
		files: [
			'vendor/**/*',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'copy:vendor',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},

	images: {
		files: [
			'src/images/**/*',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'copy:images',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},

	fonts: {
		files: [
			'src/fonts/**/*',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'copy:fonts',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},

	readme: {
		files: [
			'src/readme/**/*',
			'!**/dont_touch/**/*',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'concat:readme',
			'concat:readmeMd',
			'wp_readme_to_markdown:readmeMd',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},



	inc: {
		files: [
			'src/inc/**/*',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'string-replace:inc_to_dest',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},


	// assets
	js: {
		files: [
			'src/js/**/*.js',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'eslint:js',
			'uglify:debug',
			'local_sync:<%= local_sync.wp_install %>:<%= local_sync.version %>',
			'_noticeReady',
		]
	},
	commonJS: {
		files: [
			'src/commonJS/**/*.js',
			'src/commonJS/**/*.jst',
			'src/commonJS/**/*.jsx',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'eslint:commonJS',
			'browserify:debug',
			'local_sync:<%= local_sync.wp_install %>:<%= local_sync.version %>',
			'_noticeReady',
		],
		options: {
			spawn: false,
		},
	},

	styles: {
		files: [
			'src/sass/**/*.scss',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'sass:debug',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	},



	potomo_pos: {
		files: [
			'src/languages/**/*.po',
			'<%= pattern.global_exclude %>',
		],
		tasks: [
			'potomo',
			'po2json',
			'local_sync:<%= local_sync.wp_install %>',
			'_noticeReady',
		]
	}
};