/**
 * External dependencies
 */
import {
	isObject,
	isString,
	isEqual,
	isArray,
	get,
} from 'lodash';

import {
	findWhere,
} from 'underscore';

/**
 * WordPress dependencies
 */
const {
	compose,
	createHigherOrderComponent,
} = wp.compose;

const {
	Component
} = wp.element;

const {
	withSelect,
	withDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import defaults 	from './defaults';
import metaFields 	from './metaFields';

const composeWithExpaPostAtts = ( component, settingsKey = 'expa_post_atts' ) => {

	return compose( [
		withSelect( ( select ) => {
			const {
				getEditedPostAttribute,
				getCurrentPostId,
			} = select( 'core/editor' );

			// settingsKey = undefined === settingsKey ?

			const setting = getEditedPostAttribute( settingsKey );

			let state = {
				metaKey: settingsKey,
				currentPostId: getCurrentPostId(),
			};

			if ( metaFields.toSerialize.includes( settingsKey ) ){
				let meta;
				if ( isObject( setting ) ) {
					meta = setting;
				} else if ( isString( setting ) ) {
					try {
						meta = JSON.parse( setting );
					} catch(e) {
						meta = {};
					}
				} else {
					meta = {};
				}
				state = {
					...state,
					meta: meta,
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
					const newAttributes = _.mapObject( {...attributes}, ( val, key ) =>
						metaFields.toSerialize.includes( key ) ? JSON.stringify( val ) : val
					);
					editPost( newAttributes );
				},
			};
		} ),
		createHigherOrderComponent( ( WrappedComponent ) => {
			return class extends Component {
				constructor( props ) {
					super( props );

					// fix props.meta.pairs
					props.meta.pairs = isArray( props.meta.pairs ) ? props.meta.pairs :[];

					const meta = {
						pairs: [
							...defaults[props.metaKey]['pairs'],
							...props.meta.pairs,
						]
					};

					// add defaultPairs to meta.pairs, if not already existing
					const defaultPairs = this.fixDefaultPairs( props.defaultPairs );
					[...defaultPairs].map( ( value, key  ) =>
						undefined === findWhere( meta.pairs, { key: value.key } ) ? meta.pairs.push({
							key: value.key,
							value: value.value,
						}) : null
						);

					this.state = {
						metaKey: props.metaKey,
						meta: meta,
					};

				}

				fixDefaultPairs( defaultPairs ){
					let newDefaultPairs;
					if ( isObject( defaultPairs ) && ! isArray( defaultPairs )  ) {
						/*
						// if syntax is like this:
						<Component
							defaultPairs={ {
								length: '',
								diameter: '',
							} }
						/>
						*/
						newDefaultPairs = [];
						Object.entries( { ...defaultPairs } ).forEach( ( [ key, value ] ) =>
							newDefaultPairs.push({
									key: key,
									value: value,
							})
							);
					} else if ( isArray( defaultPairs ) ) {
						/*
						// if syntax is like this:
						<Component
							defaultPairs={ [
								{
									key: 'length',
									value: '',
								},
								{
									key: 'diameter',
									value: '',
								},
							] }
						/>
						*/
						newDefaultPairs = [...defaultPairs];
					}
					return newDefaultPairs;
				}

				shouldComponentUpdate( nextProps, nextState ) {
					return ! isEqual(
						get( this.props, [ 'meta', 'pairs' ], [] ),
						get( nextProps, [ 'meta', 'pairs' ], [] )
					) || ! isEqual(
						get( this.state, [ 'meta', 'pairs' ], [] ),
						get( nextState, [ 'meta', 'pairs' ], [] )
					) || ! isEqual(
						get( this.props, [ 'args' ], {} ),
						get( nextProps, [ 'args' ], {} )
					);
				}

				componentDidUpdate( prevProps ) {
					if ( ! isEqual( get( this.props, [ 'meta', 'pairs' ], [] ), get( this.state, [ 'meta', 'pairs' ], [] ) ) && undefined !== this.props.meta.pairs ) {
						this.setState( {
							...this.state,
							meta: {
								...this.state.meta,
								pairs: [...this.props.meta.pairs]
							},
						} );
					}
				}

				render() {
					return (
						<WrappedComponent
							{ ...this.props }
							{ ...this.state }
						/>
					);
				}
			};
		}, 'withExpaPostAtts' )
	] )( component );
}

export default composeWithExpaPostAtts;
