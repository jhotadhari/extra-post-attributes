const path = require('path');

const getWpInstall = ( grunt, install, wp_installs_path, counter ) => {

	const errorMsg = 'unknown local install';

	wp_installs_path = wp_installs_path ? wp_installs_path : 'wp_installs.json';

	counter = counter ? counter : 0;
	if ( counter > 9 )
		return grunt.warn( errorMsg );

	if ( grunt.file.expand( { cwd: '' }, [wp_installs_path] ).length ) {
		const pkg = grunt.file.readJSON('package.json');
		const wp_installs = grunt.file.readJSON( wp_installs_path );

		if ( install.length && typeof wp_installs[install] !== 'object' )
			grunt.warn( errorMsg );

		return path.resolve(wp_installs[install].plugins,pkg.name) + path.sep;
	}

	return getWpInstall( grunt, install, '../' + wp_installs_path, counter + 1 );
}

module.exports = getWpInstall;