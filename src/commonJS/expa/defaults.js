/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;

const defaults = {

	expa_post_atts: {
		pairs: []
	},
	pair: {
		key: '',
		value: '',
	},
};

export function getExpaDefault( key ) {
	switch( key ){
		case 'label':
			return applyFilters( 'expa.ui.label', __( 'Extra Post Attribues', 'expa' ) );
			break;
		case 'pairs':
			return applyFilters( 'expa.defaultPairs', [] );
			break;
		case 'args':
			return applyFilters( 'expa.args', {
				include: {
					all: true,
					keys: [
						// 'year',
					],
				},
				exclude: {
					emptyKeys: false,
					emptyValues: true,
					keys: [
						// 'year',
					],
				},
				formatting: {
					general: {
						format: 'list',					// 'list' || 'nestedDivs' || 'inline'
						separator: ', ',
						showLabel: true,					// 'list' || 'div'
						valueFormat: 'characterSeparated',		// 'characterSeparated' || 'list'
						valueSeparator: '/',
					},
					byKey: [],	// ??? future
				}
			} );
			break;
	}

};

export default defaults;

