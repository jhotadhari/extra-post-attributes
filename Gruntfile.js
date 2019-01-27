'use strict';

const path = require('path');
const playSound = require('./grunt/playSound');

module.exports = function(grunt){
	// load plugins
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	// load tasks
	grunt.loadTasks('grunt/tasks');
	grunt.loadNpmTasks('gruntify-eslint');
	// load config
	initConfigs(grunt, 'grunt/config');
	grunt.task.run('notify_hooks');
	onWatchUpdateConfig(grunt);
	// setupFailHooks
	setupFailHooks(grunt);
};

function initConfigs(grunt, folderPath) {

	global['dest_path'] = 'test';

	var config = {
		pattern: {
			global_exclude: [
				'!*~',
				'!**/*~',
				'!_test*',
				'!**/_test*',
				'!_del_*',
				'!**/_del_*',
				'!*.xcf',
				'!**/*.xcf',
			]
		},
		pkg: "<%= global['pkg'] %>",
		dest_path:  "<%= global['dest_path'] %>",
		commit_msg: "<%= global['commit_msg'] %>",
		changelog: "<%= global['changelog'] %>",

		// This is optional!
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5, 	// maximum number of notifications from jshint output
				// title: "Project Name", 		// defaults to the name in package.json, or will use project directory's name
				success: false, 				// whether successful grunt executions should be notified automatically
				duration: 0, 					// the duration of notification in seconds, for `notify-send only
			}
		},

	};

	global['pkg'] = grunt.file.readJSON("package.json");

    grunt.file.expand(folderPath + '/**/*.js').forEach(function(filePath) {
        var fileName = filePath.split('/').pop().split('.')[0];
        var fileData = require('./' + filePath);
        config[fileName] = fileData;
    });
    grunt.initConfig(config);
}

function onWatchUpdateConfig( grunt ) {
	let changedFiles = Object.create(null);

	let onChange = grunt.util._.debounce(function() {
		// update js config
		updateJsConfig( grunt, changedFiles );
		// update scss config
		updateScssConfig( grunt, changedFiles );
		// reset changedFiles
		changedFiles = Object.create(null);
	}, 200);

	grunt.event.on( 'watch', function( action, filepath, target ) {
		if ( 'commonJS' === target ){
			changedFiles[filepath] = action;
			onChange();
		}
	});
}

function updateJsConfig( grunt, changedFiles ) {
	let changed = Object.keys( grunt.util._.omit( changedFiles, function(value, key, object) {
		return path.extname(key) !== '.js'
	}));

	// update eslint config
	grunt.config('eslint.commonJS.src', changed);

	// update browserify config
	let config = grunt.config('browserify.debug.files' )[0];
	config.src = [];
	grunt.util._.each( changed, function( filepath ){
		let filepathCwd = filepath.replace( config.cwd + '/', '' );
		// console.log( 'filepathCwd', filepathCwd );		// ??? debug

		if ( -1 !== filepathCwd.indexOf('/') ) {
			config.src.push( filepathCwd.substring( 0, filepathCwd.indexOf('/') ) + '.js' );
			grunt.option( 'silent', true );
		} else {
			config.src.push( filepathCwd );
			grunt.option( 'silent', false );
		}
	});
	grunt.config('browserify.debug.files', [config]);
}

function updateScssConfig( grunt, changedFiles ) {
	// let changed = Object.keys( grunt.util._.omit( changedFiles, function(value, key, object) {
	// 	return path.extname(key) !== '.scss'
	// }));
	// ... waiting for sunshine
}

function setupFailHooks( grunt ) {
	grunt.util.hooker.hook(grunt, 'warn', () => playSound( grunt, 'fail' ) );
	grunt.util.hooker.hook(grunt.fail, 'warn', () => playSound( grunt, 'fail' ));
	// run on error
	grunt.util.hooker.hook(grunt.fail, 'error', () => playSound( grunt, 'fail' ));
	grunt.util.hooker.hook(grunt.log, 'fail', () => playSound( grunt, 'fail' ));
	grunt.util.hooker.hook(grunt.log, 'error', () => playSound( grunt, 'fail' ));
	// run on fatal
	grunt.util.hooker.hook(grunt.fail, 'fatal', () => playSound( grunt, 'fail' ));
}
