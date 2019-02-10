module.exports = function(grunt){
	grunt.registerTask('watch_sync', 'watch file changes, build them to test, and sync test to local wp install', function( install, version ){

		// check if args
		if ( arguments.length === 0 ){
			// grunt.warn("local install must be specified");
			install = '';
		}
		// check if arg install is empty str
		if ( install === '' ){
			grunt.log.writeln('sync dest is empty ... no sync, just watch');
		}
		// set version 'test' if empty or undefined
		if ( version === '' || typeof version === 'undefined'){
			version = 'test';
		}

		// set config
		grunt.config.set('local_sync',{
			wp_install: install,
			version: version
		});

		// run tasks
		grunt.task.run([
			'watch',
		]);

	});
};