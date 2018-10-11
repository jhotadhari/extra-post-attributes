<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Returns the pair-values-markup for a label. One of $post_id or $pairs is required. If $pairs given, returns pair-values-markup for these pairs, else returns pair-values-markup for pairs of given post_type.
 *
 * @param int			$post_id
 * @param array			$pairs
 * @param string		$pair_label
 * @param array			$args			The args Block Attribute
 * @return								An array of pair values.
 */
function expa_get_formatted_values_by_label( $post_id = null, $pairs = null, $pair_label = null, $args = array() ) {
	if ( null === $pair_label )
		return '';
	$pairs = expa_get_pairs_by_postid( $post_id, $pairs );

	switch( expa_array_get( $args, 'formatting.general.valueFormat' ) ) {
		case 'characterSeparated':
			return implode( '', array(
				'<span>',
					implode( expa_array_get( $args, 'formatting.general.valueSeparator', '/' ), expa_get_values_by_label( $post_id , $pairs, $pair_label ) ),
				'</span>',
			) );

		case 'list':
			return implode( '', array_merge(
				array( '<ul>' ),
				array_map( function( $value ) {
					return '<li>' . $value . '</li>';
				}, expa_get_values_by_label( $post_id , $pairs, $pair_label ) ),
				array( '</ul>' )
			) );
	}
}

