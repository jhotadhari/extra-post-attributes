/**
 * External dependencies
 */
import extender from 'object-extender';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	Toolbar,
} = wp.components;
const {
	InspectorControls,
	BlockControls,
} = wp.editor;

/**
 * Internal dependencies
 */
import defaults 					from './expa/defaults';
import { getExpaDefault }			from './expa/defaults';
import composeWithExpaPostAtts		from './expa/composeWithExpaPostAtts';
import BasePrintPairsComponent 		from './expa/components/BasePrintPairsComponent.jsx';
import BasePopoverPairsComponent 	from './expa/components/BasePopoverPairsComponent.jsx';
import BaseBlockInspector 			from './expa/components/BlockInspector.jsx';

// compose components
const PrintPairsComponent = composeWithExpaPostAtts( BasePrintPairsComponent );
const BlockInspector = composeWithExpaPostAtts( BaseBlockInspector );
const PopoverPairsComponent = composeWithExpaPostAtts( BasePopoverPairsComponent );

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

    	const label = getExpaDefault( 'label' );

        return <>

			<BlockControls>
				<Toolbar>
					<PopoverPairsComponent
						label={ label }
						defaultPairs={ getExpaDefault( 'pairs' ) }
						popoverPosition={ 'middle left' }
					/>
				</Toolbar>
			</BlockControls>

			<InspectorControls>
				<BlockInspector
					label={ label }
					setAttributes={ setAttributes }
					args={ args }
					defaultPairs={ getExpaDefault( 'pairs' ) }
				/>
			</InspectorControls>

			<div
				className={ className }
			>
				<PrintPairsComponent
					label={ label }
					args={ args }
					defaultPairs={ getExpaDefault( 'pairs' ) }
					setAttributes={ setAttributes }
					postId={ attributes.postId }
				/>
			</div>
        </>;
    },

    save( { attributes } ) {
        return null;
    }

});
