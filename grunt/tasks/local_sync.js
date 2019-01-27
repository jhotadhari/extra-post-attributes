var path = require('path');
var getWpInstall = require('../getWpInstall');

module.exports = function(grunt){
	grunt.registerTask('local_sync', 'sync to local wp install', function( install, version ){

		// check if args
		if ( arguments.length === 0 )
			return grunt.warn("local install must be specified");

		// check if arg install is empty str
		if ( install === '' )
			return grunt.warn('sync dest is empty ... no sync');
		// set version 'test' if empty or undefined
		if ( undefined === version || ! version.length ) {
			grunt.log.writeln('version empty or undefined ... destination set to "./test/"');
			version = 'test';
		}

		var src;
		if ( version === 'test' ){
			src = path.resolve('test') + path.sep;

		} else if ( version === 'trunk'){
			src = path.resolve('dist','trunk') + path.sep;

		} else if ( /((\d)\.(\d)\.(\d))/.test(version)){
			src = path.resolve('dist','tags',version) + path.sep;

			if (! grunt.file.exists(src)){
				grunt.warn('"' + version + '" is no valid version');
			}
		} else {
			grunt.warn('"' + version + '" is no valid version');
		}

		var dest = getWpInstall(grunt, install);

		// set config
		grunt.config.merge({
			local_sync: {
				src: src,
				dest: dest,
			}
		});

		// run tasks
		grunt.task.run([
			'rsync:local_sync'
		]);

	});
};