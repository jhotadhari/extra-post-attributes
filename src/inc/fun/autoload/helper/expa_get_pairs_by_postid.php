<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Get the pairs array for a given post_id
 *
 * @since 0.0.2
 *
 * @param int		$post_id	The post id
 * @param array		$pairs		If pairs already given, just return them
 * @return array				The pairs array for the given post_id
 */

function expa_get_pairs_by_postid( $post_id = null, $pairs = null ) {
	// if pairs already given, return pairs
	if ( null !== $pairs && is_array( $pairs ) )
		return $pairs;
	if ( null === $post_id && null === $pairs )
		return array();
	if ( null === $pairs && $post_id > 0 ) {
		$expa_post_atts = get_post_meta( $post_id, 'expa_post_atts', true );
		$pairs = expa_array_get( $expa_post_atts, 'pairs', array() );
	}
	return array();
}
