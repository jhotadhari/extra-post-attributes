/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import {
	isObject,
	isEqual,
	uniq,
	get,
} from 'lodash';
import {
	isArray,
	findWhere,
	where,
	reject,
} from 'underscore';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Component
} = wp.element;

const {
    Button,
    Dashicon,
    IconButton,
    BaseControl,
    CheckboxControl,
    SelectControl,
    PanelBody,
    TextControl,
    ToggleControl,
} = wp.components;

/**
 * Internal dependencies
 */
import defaults 					from '../defaults';
import { getExpaDefault }			from '../defaults';
import composeWithExpaPostAtts		from '../composeWithExpaPostAtts';
import BasePopoverPairsComponent 	from './BasePopoverPairsComponent.jsx';

// compose components
const PopoverPairsComponent = composeWithExpaPostAtts( BasePopoverPairsComponent, 'expa_post_atts' );

class BlockInspector extends Component {

	constructor( props ) {
		super( ...arguments );
		this.getOptions = this.getOptions.bind( this );
	}

	getOptions( option ) {
		const { meta: { pairs } } = this.props
		switch( option ) {
			case 'pairs':
				const pairLabels = uniq( [...pairs].map( pair => pair.key ) );
				return [...pairLabels].map( label => { return { value: label, label: label } } );
			case 'valueFormat':
				return [
					{ value: 'list', label: __( 'List', 'expa' ) },
					{ value: 'characterSeparated', label: __( 'Character separated', 'expa' ) },
				];
			case 'format':
				return [
					{ value: 'list', label: __( 'List', 'expa' ) },
					{ value: 'nestedDivs', label: __( 'Nested Divs', 'expa' ) },
					{ value: 'inline', label: __( 'Inline', 'expa' ) },
				];
		}
	}

	render() {

		const {
			setAttributes,
			metaKey,
			label,
			args,
		} = this.props;

		return [

			<div className={ 'expa-inspector' } >

				<PanelBody
					title={ 'Post Meta data' }
					icon="upload"
					initialOpen={ false }
					className={ 'cgb-inspector-panel' }
				>

					<BaseControl
						label={ label }
						className={ 'expa-base-control-row' }
					>
						<PopoverPairsComponent
							label={ label }
							defaultPairs={ getExpaDefault( 'pairs' ) }
						/>
					</BaseControl>

				</PanelBody>

				{ /**
				  *	Include
				  */ }
				<PanelBody
					title={ 'Include' }
					icon="yes"
					initialOpen={ false }
					className={ 'cgb-inspector-panel' }
				>

					<CheckboxControl
						label={ __( 'Include all', 'expa' ) }
						checked={ get( args, ['include', 'all'] ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								include: {
									...args.include,
									all: val,
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

					{ ! args.include.all &&
						<SelectControl
							multiple
							label={ __( 'Include by key', 'expa' ) + ':' }
							value={ get( args, ['include', 'keys'] ) }
							options={ this.getOptions( 'pairs' ) }
							onChange={ ( val ) => {
								const newArgs = {
									...args,
									include: {
										...args.include,
										keys: val,
									},
								};
								setAttributes( {
									args: JSON.stringify( newArgs ),
								} );
							} }
						/>
					}

				</PanelBody>

				{ /**
				  *	Exclude
				  */ }
				<PanelBody
					title={ 'Exclude' }
					icon="no-alt"
					initialOpen={ false }
					className={ 'cgb-inspector-panel' }
				>

					<div className={ 'expa-inspector-help' }>
						{ 'Exclude overwrites include' }
					</div>

					<CheckboxControl
						label={ __( 'Exclude empty keys', 'expa' ) }
						checked={ get( args, ['exclude', 'emptyKeys'] ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								exclude: {
									...args.exclude,
									emptyKeys: val,
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

					<CheckboxControl
						label={ __( 'Exclude empty values', 'expa' ) }
						checked={ get( args, ['exclude', 'emptyValues'] ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								exclude: {
									...args.exclude,
									emptyValues: val,
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

					<SelectControl
						multiple
						label={ __( 'Exclude by key', 'expa' ) + ':' }
						value={ get( args, ['exclude', 'keys'] ) }
						options={ this.getOptions( 'pairs' ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								exclude: {
									...args.exclude,
									keys: val,
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

				</PanelBody>

				{ /**
				  *	Formatting
				  */ }
				<PanelBody
					title={ 'Formatting' }
					icon="admin-customizer"
					initialOpen={ false }
					className={ 'cgb-inspector-panel' }
				>

					{/*
						<div className={ 'expa-inspector-heading' }>
							{ 'General' }
						</div>
					*/}

					<SelectControl
						label={ __( 'Format', 'expa' ) + ':' }
						value={ get( args, ['formatting', 'general', 'format'] ) }
						options={ this.getOptions( 'format' ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								formatting: {
									...args.formatting,
									general: {
										...args.formatting.general,
										format: val

									}
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

					{ 'inline' === get( args, ['formatting', 'general', 'format'] ) &&
						<TextControl
							label={ __( 'Separator', 'expa' ) }
							value={ get( args, ['formatting', 'general', 'separator'] ) }
							onChange={ ( val ) => {
								const newArgs = {
									...args,
									formatting: {
										...args.formatting,
										general: {
											...args.formatting.general,
											separator: val

										}
									},
								};
								setAttributes( {
									args: JSON.stringify( newArgs ),
								} );
							} }
						/>
					}

					<ToggleControl
						label={ __( 'Show Labels', 'expa' ) }
						checked={  get( args, ['formatting', 'general', 'showLabel'] ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								formatting: {
									...args.formatting,
									general: {
										...args.formatting.general,
										showLabel: val

									}
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

					<SelectControl
						label={ __( 'Value Format', 'expa' ) + ':' }
						value={ get( args, ['formatting', 'general', 'valueFormat'] ) }
						options={ this.getOptions( 'valueFormat' ) }
						onChange={ ( val ) => {
							const newArgs = {
								...args,
								formatting: {
									...args.formatting,
									general: {
										...args.formatting.general,
										valueFormat: val

									}
								},
							};
							setAttributes( {
								args: JSON.stringify( newArgs ),
							} );
						} }
					/>

					{ 'characterSeparated' === get( args, ['formatting', 'general', 'valueFormat'] ) &&
						<TextControl
							label={ __( 'Value Separator', 'expa' ) }
							value={ get( args, ['formatting', 'general', 'valueSeparator'] ) }
							onChange={ ( val ) => {
								const newArgs = {
									...args,
									formatting: {
										...args.formatting,
										general: {
											...args.formatting.general,
											valueSeparator: val

										}
									},
								};
								setAttributes( {
									args: JSON.stringify( newArgs ),
								} );
							} }
						/>
					}

				</PanelBody>

			</div>
		];
	}
}

export default BlockInspector;