/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import {
	isArray,
	findWhere,
	isObject,
	where,
} from 'underscore';

/**
 * WordPress dependencies
 */
// const { __ } = wp.i18n;

const {
	Component
} = wp.element;

const {
    Button,
    Dashicon,
    Dropdown,
    IconButton,
    BaseControl,
} = wp.components;

/**
 * Internal dependencies
 */
import defaults 					from '../defaults';

class BasePostSettingsPopoverPairsComponent extends Component {
	constructor( props ) {
		super( ...arguments );

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

		this.isPairRemoveable = this.isPairRemoveable.bind(this);
		this.setNewPairs = this.setNewPairs.bind(this);
		this.onAddNewPair = this.onAddNewPair.bind(this);
		this.onRemovePair = this.onRemovePair.bind(this);
		this.onChangePair = this.onChangePair.bind(this);
		this.onMovePairUp = this.onMovePairUp.bind(this);
		this.onMovePairDown = this.onMovePairDown.bind(this);
	}

	fixDefaultPairs( defaultPairs ){
		let newDefaultPairs;
		if ( isObject( defaultPairs ) && ! isArray( defaultPairs )  ) {
			/*
				// if syntax is like this:
				<BasePostSettingsPopoverPairsComponent
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
				<BasePostSettingsPopoverPairsComponent
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

	isPairRemoveable( index ){
		const { defaultPairs } = this.props;
		const { meta: { pairs } } = this.state;
		return undefined === findWhere( defaultPairs, { key: pairs[index]['key'] } )	// is pair key existing in defaults?
			? true																		// not in defaults -> is removeable
			: where( pairs, { key: pairs[index]['key'] } ).length > 1;					// in defaults -> removeable if more then one pair with this key
	}

	setNewPairs( newPairs ){
		const { metaKey, onUpdatePostAttribute } = this.props;
		const { meta, meta: { pairs } } = this.state;
		const newMeta = {
			...meta,
			pairs: newPairs,
		};
		this.setState( { meta: newMeta } );
		onUpdatePostAttribute( { [metaKey]: newMeta } );
	}

	onAddNewPair(){
		const { meta: { pairs } } = this.state;
		const newPairs = [...pairs];
		newPairs.push({ ...defaults.pair });
		this.setNewPairs( newPairs );
	}

	onRemovePair( index ) {
		const { meta: { pairs } } = this.state;
		if ( ! this.isPairRemoveable( index ) ) return;
		const newPairs = [...pairs];
		newPairs.splice(index, 1);
		this.setNewPairs( newPairs );
	}

	onChangePair( index, key, value  ) {
		const { meta: { pairs } } = this.state;
		const newPairs = [...pairs];
		const newPair ={
			...newPairs[index],
			[key]: value
		};
		newPairs[index] = newPair;
		this.setNewPairs( newPairs );
	}

	onMovePairUp( index  ) {
		const { meta: { pairs } } = this.state;
		if ( index === 0 ) return;
		const newPairs = arrayMove( [...pairs], index, index - 1 );
		this.setNewPairs( newPairs );
	}

	onMovePairDown( index  ) {
		const { meta: { pairs } } = this.state;
		if ( index === pairs.length - 1 ) return;
		const newPairs = arrayMove( [...pairs], index, index + 1 );
		this.setNewPairs( newPairs );
	}

	render() {

		const {
			metaKey,
			label,
		} = this.props;

		const {
			meta,
		} = this.state
		const { pairs } = meta;

		return [

			<div className="components-panel__row">

				<span>
					{ label }
				</span>

				<Dropdown
					contentClassName="expa-popover-content"
					position="middle left"
					expandOnMobile={true}
					className={''}
					renderToggle={ ( { isOpen, onToggle, onClose } ) => (
						<Button
							onClick={ onToggle } aria-expanded={ isOpen }
							className={'expa-button'}
							title={ label }
						>
							<Dashicon icon={ 'editor-expand' } className="" />
						</Button>
					) }
					renderContent={ ({ isOpen, onToggle, onClose }) => (
						<div className={ 'expa-pairs expa-pairs-' + metaKey }>

							<div className="components-popover__header">
								<span className="components-popover__header-title">
									{ label }
								</span>
								<IconButton className="components-popover__close" icon="no-alt" onClick={ onClose } />
							</div>

							<div className={ 'expa-popover-content-inner expa-pairs-inner' }>

								{ pairs.map( ( pair, index ) => [

									<div className={ 'expa-flex-row' }>

										<BaseControl
											className={ 'expa-pairs-field key' }
										>
											<input
												value={ pair.key }
												onChange={ ( event ) => this.onChangePair( index, 'key', event.target.value ) }
												type="text"
											/>
										</BaseControl>

										<Dashicon icon={ 'arrow-right-alt' } className={ 'expa-pairs-delimiter' } />

										<BaseControl
											className={ 'expa-pairs-field value' }
										>
											<input
												value={ pair.value }
												onChange={ ( event ) => this.onChangePair( index, 'value', event.target.value ) }
												type="text"
											/>
										</BaseControl>

										<Button
											onClick={ ( event ) => this.onMovePairUp( index ) }
											className={'expa-move-item-up expa-button'}
											disabled={ index === 0 }
										>
											<Dashicon icon={ 'arrow-up-alt' } className="" />
										</Button>

										<Button
											onClick={ ( event ) => this.onMovePairDown( index ) }
											className={'expa-move-item-down expa-button'}
											disabled={ index + 1 === pairs.length }
										>
											<Dashicon icon={ 'arrow-down-alt' } className="" />
										</Button>

										<Button
											onClick={ ( event ) => this.onRemovePair( index ) }
											className={'expa-remove-item expa-button'}
											disabled={ ! this.isPairRemoveable( index ) }
										>
											<Dashicon icon={ 'minus' } className="" />
										</Button>

									</div>

								] ) }

							</div>

							<div className="expa-pairs-bottom">
								<IconButton
									className="expa-add-item expa-button"
									icon="plus"
									onClick={ this.onAddNewPair }
								/>
							</div>

						</div>
					) }
				/>
			</div>
		];
	}
}

BasePostSettingsPopoverPairsComponent.propTypes = {
	metaKey: PropTypes.string,
	// meta: PropTypes.shape({
	// 	pairs: PropTypes.array,
    // }),
	defaultPairs: PropTypes.object,		// array should be object as well
}

BasePostSettingsPopoverPairsComponent.defaultProps = {
	label: 'Extra Post Attribues',
	// meta: {
	// 	pairs: [],
    // },
	defaultPairs: [],
}

export default BasePostSettingsPopoverPairsComponent;