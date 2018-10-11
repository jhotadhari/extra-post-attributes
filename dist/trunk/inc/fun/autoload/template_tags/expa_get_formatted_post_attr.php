<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Get the formatted post attr
 *
 * @param WP_Post		$post				post object
 * @param string		$attr_key			the attribute key
 * @param string|false	$delimiter			The delimiter, separates the values. If false, returns first match only
 * @param string		$before				string to prepend
 * @param string		$after				string to append
 *
 * @return string		$attr_formatted		attr values as string. separated by delimiter
 */
function expa_get_formatted_post_attr( $post = null, $attr_key = null, $delimiter = '', $before = '', $after = ''  ) {
	if ( null === $attr_key )
		return false;

	if ( 'string' !== gettype( $delimiter ) ) {
		if ( false !== $delimiter ) return false;
	}

	// if no post given, may be use queried_object
	if ( null === $post ) {
		$post = get_queried_object();
		if ( ! $post instanceof WP_Post )
			return;
	}

	// get meta. if something wrong, get out
	$expa_post_atts = get_post_meta( $post->ID, 'expa_post_atts', true );
	if ( empty( $expa_post_atts ) || ! is_array( $expa_post_atts ) )
		return;
	if ( ! array_key_exists( 'pairs', $expa_post_atts ) || empty( $expa_post_atts['pairs'] ) )
		return;

	// attr array, a list of found values
	$attr = array();
	// loop pairs, search for key, store value
	foreach( $expa_post_atts['pairs'] as $pair ) {
		// check if key is the one we are searching for
		if ( $attr_key === $pair['key'] ) {
			// add value to attr array
			$attr[] = $pair['value'];
			if ( false === $delimiter )
				break;
		}
	}

	// return the values as string
	$attr_formatted = $before . implode( $delimiter, $attr ) . $after;
	return $attr_formatted;
}
