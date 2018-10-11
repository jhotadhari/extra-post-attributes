<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Receives an array of posts and returns an sorted array of attr keys with associated posts
 *
 * @param array		$posts		array of post objects
 * @param string	$attr_key	the attribute key to structure and sort by
 * @param string	$order		'ASC' || 'DESC'
 *
 * @return array	$atts_list	array of attr keys with associated posts
 */
function expa_structure_posts_by_post_attr_key( $posts = array(), $attr_key = null, $order = 'ASC' ) {
	if ( 0 === count( $posts ) )
		return false;

	if ( null === $attr_key )
		return false;

	// build atts_list
	$atts_list = array();
	foreach( $posts as $post ) {

		$expa_post_atts = get_post_meta( $post->ID, 'expa_post_atts', true );

		if ( empty( $expa_post_atts ) || ! is_array( $expa_post_atts ) )
			continue;

		if ( ! array_key_exists( 'pairs', $expa_post_atts ) || empty( $expa_post_atts['pairs'] ) )
			continue;

		foreach( $expa_post_atts['pairs'] as $pair ) {

			if ( $attr_key === $pair['key'] ) {
				if ( array_key_exists( $pair['value'], $atts_list ) ) {
					$atts_list[$pair['value']][] = $post;
				} else {
					$atts_list[$pair['value']] = array(
						$post,
					);
				}
			}

		}
	}

	// sort atts_list
	ksort ( $atts_list );

	// maybe descending
	if ( 'DESC' === $order )
		$atts_list = array_reverse( $atts_list, true );

	return $atts_list;

}

?>