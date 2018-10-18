/**
 * External dependencies
 */
import extender from 'object-extender';
import PropTypes from 'prop-types';
import {
	uniq,
	get,
} from 'lodash';
import {
	where,
	reject,
} from 'underscore';

/**
 * WordPress dependencies
 */
const { addFilter, applyFilters } = wp.hooks;

const {
	Component
} = wp.element;

/**
 * Internal dependencies
 */
import defaults 					from '../defaults';
import { getExpaDefault } 			from '../defaults';

class BasePrintPairsComponent extends Component {

	constructor( props ) {
		super( ...arguments );

		this.renderValues = this.renderValues.bind( this );
		this.getPairValues = this.getPairValues.bind( this );
		this.getFilteredPairs = this.getFilteredPairs.bind( this );
		this.getUniqueLabels = this.getUniqueLabels.bind( this );
	}

	// set initial block attributes
	componentDidMount() {
		const { currentPostId, setAttributes, postId, args } = this.props;
		const mergedAtts = extender.merge( getExpaDefault( 'args' ), args );
		console.log( 'debug mergedAtts', mergedAtts );		// ??? debug

		setAttributes( { args: JSON.stringify( mergedAtts ) } );
		setAttributes( { postId: currentPostId } );
	}

	getPairValues( pairLabel ) {
		const { postId, meta: { pairs } } = this.props;
		return [...where( pairs, { key: pairLabel } )].map( pair => applyFilters( 'expa.pair.valueName', pair.value, pair, postId ) );
	}

	getFilteredPairs() {
		const {
			args,
			meta: { pairs },
		} = this.props;
		return reject( [...pairs].map( pair => {
			if ( ! args.include.all && ! args.include.keys.includes( pair.key ) ) return null;
			if ( args.exclude.keys.includes( pair.key ) ) return null;
			if ( args.exclude.emptyKeys && ! pair.key.length ) return null;
			if ( args.exclude.emptyValues && ! pair.value.length ) return null;
			return pair;
		} ), l => l === null )
	}

	getUniqueLabels() {
		return uniq( [...this.getFilteredPairs()].map( pair => pair.key ) );
	}

	renderValues( pairLabel ) {
		const { args } = this.props;
		switch( get( args, ['formatting', 'general', 'valueFormat'] ) ) {
			case 'characterSeparated':
				return (
					<span>
						{ this.getPairValues( pairLabel ).join( get( args, ['formatting', 'general', 'valueSeparator'] ) ) }
					</span>
				);
			case 'list':
				return (
					<ul>
						{ [...this.getPairValues( pairLabel )].map( ( value, index ) =>
							<li key={ index }>
								{ value }
							</li>
						) }
					</ul>
				);
		}
	}

	render() {

		const {
			metaKey,
			label,
			args,
			postId,
		} = this.props;

		const format = get( args, ['formatting', 'general', 'format'] );
		let TagOuter = 'div';
		let TagInner = 'div';
		switch( format ){
			case 'list':
				TagOuter = 'ul';
				TagInner = 'li';
				break;
			// case 'nestedDivs':
			case 'inline':
				TagOuter = 'span';
				TagInner = 'span';
				break;
		}

		const uniqueLabels = this.getUniqueLabels();

		return [
			<div
				className={ 'expa-pairs' }
				style={ uniqueLabels.length ? {} : { minHeight: '50px' } }
			>

				<TagOuter>
					{ [...uniqueLabels].map( ( pairLabel, index ) => [
						<TagInner
							key={ pairLabel }
						>

							{ get( args, ['formatting', 'general', 'showLabel'] ) && pairLabel.length ? (
								<span>
									{ applyFilters( 'expa.pair.labelName', pairLabel, postId ) + ': ' }
								</span>
							) : ( '' ) }
							{ this.renderValues( pairLabel ) }

							{ 'inline' === format && uniqueLabels.length - 1 > index &&
								<span>
									{ get( args, ['formatting', 'general', 'separator'], '' ) }
								</span>
							}

						</TagInner>,
					], [] ) }
				</TagOuter>

			</div>
		];
	}
}

BasePrintPairsComponent.propTypes = {
	metaKey: PropTypes.string,
	// meta: PropTypes.shape({
	// 	pairs: PropTypes.array,
    // }),
	defaultPairs: PropTypes.array,
}

BasePrintPairsComponent.defaultProps = {
	label: 'Extra Post Attribues',
	// meta: {
	// 	pairs: [],
    // },
	defaultPairs: [],
}

export default BasePrintPairsComponent;