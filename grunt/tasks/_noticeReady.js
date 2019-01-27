// const player = require('play-sound')();

const playSound = require('../playSound');

module.exports = function(grunt){

	// _noticeReady
	// used by build.js
	// used by dist.js
	grunt.registerTask('_noticeReady', 'sub task', function( process ) {




		switch( process ){
			case undefined:
				playSound( grunt, 'success_short' );
				break;

			case 'build':
				playSound( grunt, 'success' );
				grunt.log.writeln( '' );
				grunt.log.writeln( '' );
				grunt.log.writeln( 'Build done.' );
				break;
			case 'dist':
				playSound( grunt, 'success_long' );
				grunt.log.writeln( '' );
				grunt.log.writeln( '' );
				grunt.log.writeln( 'Dist done.' );
				if ( grunt.option('git') !== false ) {
					if ( grunt.option('git:commit') !== false )
						grunt.log.writeln( 'Don\'t forget to push the new commit.' );
					if ( grunt.option('git:tag') !== false ) {
						const releaseZip = 'releases/' + global["pkg"].name + '-' + global["pkg"].version + '.zip';
						grunt.log.writeln( 'Don\'t forget to push the new tag.' );
						grunt.log.writeln( 'If this plugin should be possible to update via \'GitHub Updater Plugin\', you need to add the \'' + releaseZip + '\' archive as a realease asset.' );
					}
				}
				break;
		}

	});
};