# Extra Post Attributes #
**Tags:** gutenberg,attributes,meta  
**Donate link:** https://waterproof-webdesign.info/donate  
**Contributors:** [jhotadhari](https://profiles.wordpress.org/jhotadhari)  
**Tested up to:** 4.9.8  
**Requires at least:** 4.9.6  
**Requires PHP:** 5.6  
**Stable tag:** trunk  
**License:** GNU General Public License v2 or later  
**License URI:** http://www.gnu.org/licenses/gpl-2.0.html  

Store additional attributes for post, pages and custom post types


## Description ##

> Store additional attributes for post, pages and custom post types.

- GUI element for gutenbergs post-status-info.
- Gutenberg Block "Extra Post Attributes" to display formatted attributes
- Possible to set pairs with same key or without key.
- Possibility to set default pairs, see 'js filters'. Default pairs can't be removed by user. At least one pair with that key must be existing.

## Usage within Gutenberg

**Post Status Info Control: "Extra Post Attribues"**
To add/update/delete the Extra Post Attribute Pairs. The Pairs are saved to the post meta data.
The control is located within the publish panel.

**Block: "Extra Post Attributes"**
To display Extra Post Attribute Pairs.
The Block is server side rendered in frontend. And rendered by ReactJS in Gutenberg.
Block Sidebar Panels:
- Post Meta Data: To add/update/delete the Extra Post Attribute Pairs. The Pairs are saved to the post meta data.
- Inlcude: Display only attribute pairs with certain keys.
- Exclude: Exlcude attribute pairs with certain keys. Exlcude overwrites Include.
- Formatting

## Meta Data Usage

Stores data as an array of ```{ key: '', value: '' }``` objects.
The meta key is **```expa_post_atts```**. Note: The array is wrapped in an object ```pairs```.
Example to access the ```pairs``` using the ```expa_get_pairs_by_postid``` helper function:
```
$expa_pairs = expa_get_pairs_by_postid( $post->ID );
foreach( $expa_pairs as $pair ) {
    // ... do something
}
```
Example to access the ```pairs``` without helper function:
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
**Php functions**
- ```expa_get_filtered_pairs```: Returns an array of filtered pairs. Filtered by 'args Block Attribute. One of $post_id or $pairs is required. If $pairs given, filters these pairs, else filters pairs for given post_type.
- ```expa_get_formatted_values_by_label```: Returns the pair-values-markup for a label. One of $post_id or $pairs is required. If $pairs given, returns pair-values-markup for these pairs, else returns pair-values-markup for pairs of given post_type.
- ```expa_get_values_by_label```: Returns an array of pair values for a label. One of $post_id or $pairs is required. If $pairs given, returns values for these pairs, else returns values for pairs of given post_type.
- **helper**:
  - ```expa_array_get```: Gets the value at path of array. If no resolved value, the defaultValue is returned.
  - ```expa_decode_attributes```: Receives an Block Attributes array, decodes stringified_values and returns new attributes array.
  - ```expa_get_post_types```: Returns an array of post types, includes 'post', 'page' and all custom post types except 'wp_block'.
  - ```expa_get_pairs_by_postid```:  Get the pairs array for a given post_id.
  - ```expa_structure_posts_by_post_attr_key```: Receives an array of posts and returns an sorted array of attr keys with associated posts.
- **template tags**:
  - ```expa_get_formatted_post_attr```: Get the formatted post attr
  - ```expa_get_formatted_post_list_by_attr```: returns a list of post_attr values (for one key) with associated posts





## Customization
### php filters:
**```expa_pair_label_name```** and **```expa_pair_value_name```**
Allows Plugins/themes to filter the key (label) and value name.
Example, translate key (label) and values in frontend:
```
function prefix_translate_string( $string ) {
	return __( $string, 'my-textdomain' );
}
add_filter( 'expa_pair_label_name', 'prefix_translate_string' );
add_filter( 'expa_pair_value_name', 'prefix_translate_string' );

```
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
**```expa.pair.labelName```** and **```expa.pair.valueName```**
Allows Plugins/themes to change the label or value string displayed in the block. Example, translate key (label) and values in the block in Gutenberg:
```
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const translateString = ( string ) => __( string, 'my-textdomain' );
addFilter( 'expa.pair.labelName', 'mytheme/translateString', translateString );
addFilter( 'expa.pair.valueName', 'mytheme/translateString', translateString );
```
**```expa.ui.label```**
Allows Plugins/themes to change the label of the sidebar control. Example, change the label for pages
```
const { __ } = wp.i18n;
const { select } = wp.data;
const { addFilter } = wp.hooks;
addFilter( 'expa.ui.label', 'mytheme/expa/ui/label/page', ( label ) =>
	'page' === select( 'core/editor' ).getCurrentPostType() ? __( 'My Page Extra Attribues' ) : label
);
```
**```expa.ui.pairsComponent.bottom```**
Allows Plugins/themes to append a string to the "Extra Post Attribues" control popover. Example, add a help message.
```
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
addFilter( 'expa.ui.pairsComponent.bottom', 'mytheme/expa/ui/pairsComponent/bottom', ( string ) =>
	__( 'This is a very helpful message!', 'my-textdomain' )
);
```
**```expa.defaultPairs```**
Allows Plugins/themes to set default attributes pairs. Example, set a color field for pages:
```
const { __ } = wp.i18n;
const { select } = wp.data;
const { addFilter } = wp.hooks;
addFilter( 'expa.defaultPairs', 'mytheme/expa/defaultPairs', ( defaultPairs ) =>  'page' === select( 'core/editor' ).getCurrentPostType() ? [
	{
		key: 'color',
		value: '',
	},
] : defaultPairs );
```
**```expa.args```**
Allows Plugins/themes to set default attributes args. Example, by default for pages, display only pairs with key 'color' in the block:
```
const { __ } = wp.i18n;
const { select } = wp.data;
const { addFilter } = wp.hooks;
addFilter( 'expa.args', 'mytheme/expa/args', ( args ) =>  'page' === select( 'core/editor' ).getCurrentPostType() ? [
	{
		...args,
		include: {
		    ...args.include,
		    keys: ['color'],
		}
	},
] : args );
```


> This Plugin is generated with [generator-pluginboilerplate version 1.2.3](https://github.com/jhotadhari/generator-pluginboilerplate)

## Installation ##
Upload and install this Plugin the same way you'd install any other plugin.

## Screenshots ##

## Upgrade Notice ##

## Changelog ##


0.0.3
see commit messages

0.0.2
added block

0.0.1
looks stable

