
/**
 * WordPress dependencies
 */
const {
	compose
} = wp.compose;

const {
	withSelect,
	withDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import metaFields from './metaFields';

const composeWithPostSettings = ( component, settingsKey ) => compose( [
	withSelect( ( select ) => {
		const {
			getEditedPostAttribute,
		} = select( 'core/editor' );

		const setting = getEditedPostAttribute( settingsKey );

		let state = {
			metaKey: settingsKey,
		};

		if ( metaFields.toSerialize.includes( settingsKey ) ){
			state = {
				...state,
				meta: 'string' === typeof( setting ) ? {} : setting,
			};
		} else if ( metaFields.strings.includes( settingsKey ) ) {
			state = {
				...state,
				meta: 'string' === typeof( setting ) ? setting : '',
			};
		} else if ( metaFields.numbers.includes( settingsKey ) ) {
			state = {
				...state,
				meta: isNaN( setting ) ? '' : setting,
			};
		}

		return state;
	} ),
	withDispatch( ( dispatch ) => {
		const { savePost, editPost } = dispatch( 'core/editor' );

		return {
			onSave: savePost,
			onUpdatePostAttribute( attributes ) {
				const newAttributes = _.mapObject( {...attributes}, ( val, key ) => {
					if ( metaFields.toSerialize.includes( key) ){
						try {
							JSON.parse( this.toJSON()[key] );
						} catch(e) {
							return JSON.stringify( val );
						}
					}
					return val;
				});
				editPost( newAttributes );
			},
		};

	} ),
] )( component );

export default composeWithPostSettings;