<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Returns an array of filtered pairs. Filtered by 'args Block Attribute. 'One of $post_id or $pairs is required. If $pairs given, filters these pairs, else filters pairs for given post_type.
 *
 * @since 0.0.2
 *
 * @param int			$post_id
 * @param array			$pairs			pairs to filter
 * @param array			$args			The args Block Attribute
 * @return
 */
function expa_get_filtered_pairs( $post_id = null, $pairs = null, $args = array() ) {
	$pairs = expa_get_pairs_by_postid( $post_id, $pairs );

	$filtered_pairs = array();
	foreach( $pairs as $pair ) {
		if ( ! expa_array_get( $args, 'include.all' ) && ! array_key_exists( $pair['key'], expa_array_get( $args, 'include.keys', array() ) ) )
			continue;
		if ( in_array( $pair['key'], expa_array_get( $args, 'exclude.keys', array() ) ) )
			continue;
		if ( expa_array_get( $args, 'exclude.emptyKeys' ) && strlen( $pair['key'] ) === 0 )
			continue;
		if ( expa_array_get( $args, 'exclude.emptyValues' ) && strlen( $pair['value'] ) === 0 )
			continue;
		if ( ! array_key_exists( $pair['key'], $filtered_pairs ) )
			array_push( $filtered_pairs, $pair );
	}

	return $filtered_pairs;
}

