/**
 * Wordpress dependencies
 */
const { __, setLocaleData } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Fragment } = wp.element;
const { PluginPostStatusInfo } = wp.editPost;
const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import BasePostSettingsPopoverPairsComponent 	from './expa_editor_plugin/components/BasePostSettingsPopoverPairsComponent.jsx';
import composeWithPostSettings					from './expa_editor_plugin/composeWithPostSettings';

// compose components
const PostSettingsPopoverPairsComponent = composeWithPostSettings( BasePostSettingsPopoverPairsComponent, 'expa_post_atts' );

setLocaleData( expaData.locale, 'expa' );

const ExpaPostStatusInfoRow = () => (
    <Fragment>

		<PluginPostStatusInfo
			className='expa-post-setting-row'
		>

			<PostSettingsPopoverPairsComponent
				label={ applyFilters( 'expa.postSettingsPairs.label', __( 'Extra Post Attribues', 'expa' ) ) }
				defaultPairs={ applyFilters( 'expa.postSettingsPairs.defaultPairs', [] ) }

			/>

		</PluginPostStatusInfo>

    </Fragment>
);

registerPlugin( 'expa-extra-post-attributes', {
    render: ExpaPostStatusInfoRow,
} );



