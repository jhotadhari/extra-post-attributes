=== Extra Post Attributes ===
Tags: 
Donate link: https://waterproof-webdesign.info/donate
Contributors: jhotadhari
Tested up to: 4.9.8
Requires at least: 4.9.6
Requires PHP: 5.6
Stable tag: trunk
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Store additional attributes for post, pages and custom post types


== Description ==

> Store additional attributes for post, pages and custom post types.

- GUI element for gutenbergs post-status-info.
- Possible to set pairs with same key or without key.
- Possibility to set default pairs, see 'js filters'. Default pairs can't be removed by user. At least one pair with that key must be existing.

## Usage
Stores data as an array of ```{ key: '', value: '' }``` objects.
The meta key is **```expa_post_atts```**. Note: The array is wrapped in an object ```pairs``` for easier serialization and wp.data connection.
Example to access the ```pairs```:
```
$expa_post_atts = get_post_meta( $post->ID, 'expa_post_atts', true );
if ( empty( $expa_post_atts ) || ! is_array( $expa_post_atts ) )
	return;
if ( ! array_key_exists( 'pairs', $expa_post_atts ) || empty( $expa_post_atts['pairs'] ) )
	return;
$expa_pairs = $expa_post_atts['pairs'];
foreach( $expa_pairs as $pair ) {
    // ... do something
}
```
**Php helper functions**
- ```expa_structure_posts_by_post_attr_key```: Receives an array of posts and returns an sorted array of attr keys with associated posts
- ```expa_get_post_types```: Returns an array of post types, includes 'post', 'page' and all custom post types except 'wp_block'

  - @param string	    $return_type
  'array_keys'|'array_key_label' default: 'array_keys'.
  - @param array		$exclude
  Post Type keys to exclude

**Php template tags**
- ```expa_get_formatted_post_attr```: returns the formatted post attr
- ```expa_get_post_list_by_attr```: returns a list of post_attr values (for one key) with associated posts

## Customization
### php filters:
**```expa_post_types```**
Allows Plugins/themes to customize for which post types the plugin is enabled.
Example, enabled for ```page``` only:
```
function my_expa_pages_only( $post_types ) {
	return array( 'page' );
}
add_filter( 'expa_post_types', 'my_expa_pages_only', 10, 1 );
```
Example, exclude wooCommerce post types:
```
function my_expa_exclude_woo( $post_types ) {
    $exclude = array( 'product', 'product_variation', 'product_visibility', 'shop_order', 'shop_coupon', 'shop_webhook' );
	return expa_get_post_types( 'array_keys', $exclude );
	// or
	// return array_filter( $post_types, function( $val ) use ( $exclude ){
	// 	return ( in_array( $val, $exclude ) ? false : true );
	// } );
}
add_filter( 'expa_post_types', 'my_expa_exclude_woo', 10, 1 );
```
### js filters
**```expa.postSettingsPairs.label```**
Allows Plugins/themes to change the label. Example, change the label for pages
```
const { __ } = wp.i18n;
const { select } = wp.data;
const { addFilter } = wp.hooks;

addFilter( 'expa.postSettingsPairs.label', 'mytheme/expa/label/page', ( label ) =>
	'page' === select( 'core/editor' ).getCurrentPostType() ? __( 'My Page Extra Attribues' ) : label
);
```
**```expa.postSettingsPairs.defaultPairs```**
Allows Plugins/themes to set default attributes pairs. Example, set a color field for pages:
```
const { __ } = wp.i18n;
const { select } = wp.data;
const { addFilter } = wp.hooks;

addFilter( 'expa.postSettingsPairs.defaultPairs', 'mytheme/expa/label/page', ( defaultPairs ) =>  'page' === select( 'core/editor' ).getCurrentPostType() ? [
	{
		key: 'color',
		value: '',
	},
] : defaultPairs );
```


> This Plugin is generated with [generator-pluginboilerplate version 1.2.3](https://github.com/jhotadhari/generator-pluginboilerplate)

== Installation ==
Upload and install this Plugin the same way you'd install any other plugin.

== Screenshots ==

== Upgrade Notice ==

== Changelog ==

0.0.1
looks stable

