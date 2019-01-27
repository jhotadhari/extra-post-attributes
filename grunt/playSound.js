const player = require('play-sound')();

const playSound = ( grunt, soundKey ) => {

	if ( grunt.option( 'sound' ) === false || grunt.option( 'silent' ) === true ) {
		grunt.option( 'silent', false );
		return;
	}

	switch( soundKey ) {
		case 'fail':
			player.play(  './grunt/sounds/sfx_sounds_falling2.mp3', err => err && grunt.log( 'Could not play sound: ' + err ) );
			break;
		case 'success_short':
			// on watch
			player.play(  './grunt/sounds/Mouth_Special_00.mp3', err => err && grunt.log( 'Could not play sound: ' + err ) );
			break;
		case 'success':
			// on build
			player.play(  './grunt/sounds/sfx_sounds_fanfare3.mp3', err => err && grunt.log( 'Could not play sound: ' + err ) );
			break;
		case 'success_long':
			// on dist
			player.play(  './grunt/sounds/round_end.mp3', err => err && grunt.log( 'Could not play sound: ' + err ) );
			break;
	}
};

module.exports = playSound;
