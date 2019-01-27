/**
 * External dependencies
 */
import classnames from 'classnames';
// import {
// 	get,
// 	keys,
// } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Placeholder,
} = wp.components;

/**
 * Internal dependencies
 */

import { getExpaDefault }			from '../defaults';
import composeWithExpaPostAtts		from '../composeWithExpaPostAtts';
import BasePopoverPairsComponent 	from './BasePopoverPairsComponent.jsx';

const PopoverPairsComponent = composeWithExpaPostAtts( BasePopoverPairsComponent );

class PlaceholderNoLabels extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		// const {
		// } = this.props;

		return <>

			<Placeholder
				label={ getExpaDefault( 'label' ) }
				instructions={ __( 'Drag images, upload new ones, select images from your library or adjust the the \'Items Source\'.' ) }
				className={ classnames( 'editor-media-placeholder', 'cgb-choose-items','cgb-placeholder' ) }
			>

				<PopoverPairsComponent
					label={ getExpaDefault( 'label' ) }
					defaultPairs={ getExpaDefault( 'pairs' ) }
				/>

			</Placeholder>

		</>;

	}


}

export default PlaceholderNoLabels;
