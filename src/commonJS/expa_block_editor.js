/**
 * External dependencies
 */
import extender from 'object-extender';
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
import defaults 					from './expa/defaults';
import { getExpaDefault }			from './expa/defaults';

import composeWithExpaPostAtts		from './expa/composeWithExpaPostAtts';

import BasePrintPairsComponent 		from './expa/components/BasePrintPairsComponent.jsx';
import BaseBlockInspector 			from './expa/components/BlockInspector.jsx';

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

    	let blockAttsArgs = {};
    	try {
    		blockAttsArgs = null === attributes.args ? args : JSON.parse( attributes.args );
    	} catch(e) {
    		blockAttsArgs = blockAttsArgs;
    	}

    	const args = extender.merge( getExpaDefault( 'args' ), blockAttsArgs );

        return ([

			<InspectorControls>
				<BlockInspector
					setAttributes={ setAttributes }
					args={ args }
					defaultPairs={ getExpaDefault( 'pairs' ) }
				/>
			</InspectorControls>,

			<div
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
