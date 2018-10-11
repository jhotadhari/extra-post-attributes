/**
 * External dependencies
 */
// import _ from 'underscore';

/**
 * WordPress dependencies
 */
const { __, setLocaleData } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	BaseControl,
	CheckboxControl,
} = wp.components;
const {
	InspectorControls,
} = wp.editor;


const {
	select,
} = wp.data;

/**
 * Internal dependencies
 */
import defaults 					from './expa_editor_plugin/defaults';
import { getExpaDefault }			from './expa_editor_plugin/defaults';

import composeWithExpaPostAtts		from './expa_editor_plugin/composeWithExpaPostAtts';

import BasePrintPairsComponent 		from './expa_editor_plugin/components/BasePrintPairsComponent.jsx';
import BaseBlockInspector 			from './expa_editor_plugin/components/BlockInspector.jsx';

// compose components
const PrintPairsComponent = composeWithExpaPostAtts( BasePrintPairsComponent );
const BlockInspector = composeWithExpaPostAtts( BaseBlockInspector );

setLocaleData( expaData.locale, 'expa' );

registerBlockType( 'expa/extra-post-attributes', {
	title: __( 'Extra Post Attributes' ),
	category: 'common',

	// attributes are null, will be set by PrintPairsComponent on componentDidMount
    attributes: {
		args: {
			type: 'string',
			default: null,
		},
		postId: {
			type: 'string',
			default: null,
		},
    },

    edit( { className, attributes, setAttributes } ) {

    	let args = getExpaDefault( 'args' );
    	try {
    		args = null === attributes.args ? args : JSON.parse( attributes.args );
    	} catch(e) {
    		args = args;
    	}

        return ([

			<InspectorControls>
				<BlockInspector
					setAttributes={ setAttributes }
					args={ args }
					defaultPairs={ getExpaDefault( 'pairs' ) }
				/>
			</InspectorControls>,

			<div
				style={ { minHeight: '200px' } }
				className={ className }
			>
				<PrintPairsComponent
					args={ args }
					defaultPairs={ getExpaDefault( 'pairs' ) }
					setAttributes={ setAttributes }
					postId={ attributes.postId }
				/>
			</div>
        ]);
    },

    save( { attributes } ) {
        return null;
    }

});
