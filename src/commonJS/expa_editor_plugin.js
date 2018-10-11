/**
 * Wordpress dependencies
 */
const { __, setLocaleData } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Fragment } = wp.element;
const { PluginPostStatusInfo } = wp.editPost;
const { BaseControl } = wp.components;

/**
 * Internal dependencies
 */
import defaults 					from './expa_editor_plugin/defaults';
import { getExpaDefault }			from './expa_editor_plugin/defaults';
import composeWithExpaPostAtts		from './expa_editor_plugin/composeWithExpaPostAtts';
import BasePopoverPairsComponent 	from './expa_editor_plugin/components/BasePopoverPairsComponent.jsx';

// compose components
const PopoverPairsComponent = composeWithExpaPostAtts( BasePopoverPairsComponent );

setLocaleData( expaData.locale, 'expa' );




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
				/>

			</BaseControl>


		</PluginPostStatusInfo>

    </Fragment>
);

registerPlugin( 'expa-extra-post-attributes', {
    render: ExpaPostStatusInfoRow,
} );



