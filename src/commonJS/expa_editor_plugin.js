/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Fragment } = wp.element;
const { PluginPostStatusInfo } = wp.editPost;
const { BaseControl } = wp.components;

/**
 * Internal dependencies
 */
import defaults 					from './expa/defaults';
import { getExpaDefault }			from './expa/defaults';
import composeWithExpaPostAtts		from './expa/composeWithExpaPostAtts';
import BasePopoverPairsComponent 	from './expa/components/BasePopoverPairsComponent.jsx';

// compose components
const PopoverPairsComponent = composeWithExpaPostAtts( BasePopoverPairsComponent );

const ExpaPostStatusInfoRow = () => (
    <Fragment>

		<PluginPostStatusInfo
			className={ 'expa-post-setting-row' }
		>

			<BaseControl
				label={ getExpaDefault( 'label' ) }
				className={ 'expa-base-control-row' }
			>

				<PopoverPairsComponent
					label={ getExpaDefault( 'label' ) }
					defaultPairs={ getExpaDefault( 'pairs' ) }
					popoverPosition={ 'left middle' }
				/>

			</BaseControl>


		</PluginPostStatusInfo>

    </Fragment>
);

registerPlugin( 'expa-extra-post-attributes', {
    render: ExpaPostStatusInfoRow,
} );



