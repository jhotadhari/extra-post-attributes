<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Returns an array of pair values for a label. One of $post_id or $pairs is required. If $pairs given, returns values for these pairs, else returns values for pairs of given post_type.
 *
 * @param int			$post_id
 * @param array			$pairs
 * @param string		$pair_label
 * @return								An array of pair values.
 */
function expa_get_values_by_label( $post_id = null, $pairs = null, $pair_label = null ) {
	if ( null === $pair_label )
		return array();
	$pairs = expa_get_pairs_by_postid( $post_id, $pairs );

	$pair_matches = array_filter( $pairs, function( $pair ) use ( $pair_label ) {
		return $pair_label === $pair['key'];
	} );

	return array_map( function( $pair ) use( $post_id ) {
		$value_name = $pair['value'];
		/**
		 * Filter the value name
		 * eg: translate it
		 *
		 * @param string		$value_name
		 * @param array			$pair
		 * @param int			$post_id
		 * @return string
		 */
		return apply_filters( 'expa_pair_value_name', $value_name, $pair, $post_id );
	}, $pair_matches );
}
