/**
 * External dependencies
 */
import PropTypes 	from 'prop-types';
import classnames 	from 'classnames';
import arrayMove 	from 'array-move';
import {
	findWhere,
	where,
} from 'underscore';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
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

class BasePopoverPairsComponent extends Component {
	constructor( props ) {
		super( ...arguments );

		this.isPairRemoveable = this.isPairRemoveable.bind(this);
		this.setNewPairs = this.setNewPairs.bind(this);
		this.onAddNewPair = this.onAddNewPair.bind(this);
		this.onRemovePair = this.onRemovePair.bind(this);
		this.onChangePair = this.onChangePair.bind(this);
		this.onMovePairUp = this.onMovePairUp.bind(this);
		this.onMovePairDown = this.onMovePairDown.bind(this);
	}

	isPairRemoveable( index ){
		const {
			defaultPairs,
			meta: { pairs },
		} = this.props;
		return undefined === findWhere( defaultPairs, { key: pairs[index]['key'] } )	// is pair key existing in defaults?
			? true																		// not in defaults -> is removeable
			: where( pairs, { key: pairs[index]['key'] } ).length > 1;					// in defaults -> removeable if more then one pair with this key
	}

	setNewPairs( newPairs ){
		const {
			metaKey,
			onUpdatePostAttribute,
			meta,
			meta: { pairs },
		} = this.props;
		const newMeta = {
			...meta,
			pairs: newPairs,
		};
		onUpdatePostAttribute( { [metaKey]: newMeta } );
	}

	onAddNewPair(){
		const { meta: { pairs } } = this.props;
		const newPairs = [...pairs];
		newPairs.push({ ...defaults.pair });
		this.setNewPairs( newPairs );
	}

	onRemovePair( index ) {
		const { meta: { pairs } } = this.props;
		if ( ! this.isPairRemoveable( index ) ) return;
		const newPairs = [...pairs];
		newPairs.splice(index, 1);
		this.setNewPairs( newPairs );
	}

	onChangePair( index, key, value  ) {
		const { meta: { pairs } } = this.props;
		const newPairs = [...pairs];
		const newPair ={
			...newPairs[index],
			[key]: value
		};
		newPairs[index] = newPair;
		this.setNewPairs( newPairs );
	}

	onMovePairUp( index  ) {
		const { meta: { pairs } } = this.props;
		if ( index === 0 ) return;
		const newPairs = arrayMove( [...pairs], index, index - 1 );
		this.setNewPairs( newPairs );
	}

	onMovePairDown( index  ) {
		const { meta: { pairs } } = this.props;
		if ( index === pairs.length - 1 ) return;
		const newPairs = arrayMove( [...pairs], index, index + 1 );
		this.setNewPairs( newPairs );
	}

	render() {

		const {
			metaKey,
			label,
			popoverPosition,
			RenderToggle,
			args,	// need to pass the args to the Dropdown renderToggle to refresh the Dropdown-container-ref, when any args change. So the visible block content can be used as renderToggle.
			meta: { pairs },
		} = this.props;

		return <>
			<Dropdown
				contentClassName={ 'expa-popover-content' }
				position={ popoverPosition || 'left middle' }
				expandOnMobile={true}
				className={ '' }
				renderToggle={ ( { isOpen, onToggle, onClose } ) => <>
					{ RenderToggle && <RenderToggle isOpen={isOpen} onToggle={onToggle} onClose={onClose} args={args} /> }
					{ ! RenderToggle &&
						<Button
							onClick={ onToggle } aria-expanded={ isOpen }
							className={'expa-button'}
							title={ label + ' ' + __( 'Overview', 'expa' ) }
						>
							<Dashicon icon={ 'editor-expand' } className="" />
						</Button>
					}
				</> }
				renderContent={ ({ isOpen, onToggle, onClose }) => (
					<div
						className={ 'expa-pairs expa-pairs-' + metaKey }
						onKeyPress={ e => e.stopPropagation() }
						onKeyDown={ e => 'Escape' !== e.key && e.stopPropagation() }
					>

						<div className="components-popover__header">
							<span className="components-popover__header-title">
								{ label + ' ' + __( 'Overview', 'expa' ) }
							</span>
							<IconButton className="components-popover__close" icon="no-alt" onClick={ onClose } />
						</div>

						<div className={ classnames( 'expa-popover-content-inner', 'expa-pairs-inner' ) }>

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
										className={ classnames( 'expa-button', 'expa-move-item-up' ) }
										disabled={ index === 0 }
									>
										<Dashicon icon={ 'arrow-up-alt' } className="" />
									</Button>

									<Button
										onClick={ ( event ) => this.onMovePairDown( index ) }
										className={ classnames( 'expa-button', 'expa-move-item-down' ) }
										disabled={ index + 1 === pairs.length }
									>
										<Dashicon icon={ 'arrow-down-alt' } className="" />
									</Button>

									<Button
										onClick={ ( event ) => this.onRemovePair( index ) }
										className={ classnames( 'expa-button', 'expa-remove-item' ) }
										disabled={ ! this.isPairRemoveable( index ) }
									>
										<Dashicon icon={ 'minus' } className="" />
									</Button>

								</div>

							] ) }

						</div>

						<div className="expa-pairs-bottom">
							<IconButton
								className={ classnames( 'expa-button', 'expa-add-item' ) }
								icon="plus"
								onClick={ this.onAddNewPair }
							/>
						</div>

						<div className="expa-pairs-bottom">
							{ applyFilters( 'expa.ui.pairsComponent.bottom', '' ) }
						</div>

					</div>
				) }
			/>
		</>;
	}
}

BasePopoverPairsComponent.propTypes = {
	metaKey: PropTypes.string,
	// meta: PropTypes.shape({
	// 	pairs: PropTypes.array,
    // }),
	defaultPairs: PropTypes.array,
}

BasePopoverPairsComponent.defaultProps = {
	label: 'Extra Post Attributes',
	// meta: {
	// 	pairs: [],
    // },
	defaultPairs: [],
}

export default BasePopoverPairsComponent;