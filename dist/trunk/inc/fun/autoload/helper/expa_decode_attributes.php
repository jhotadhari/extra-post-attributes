<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Receives an Block Attributes array, decodes stringified_values and returns new attributes array
 *
 * @param array			$attributes				Block Attributes
 * @param array			$stringified_values		List of keys
 * @return array								Decoded Block Attributes
 */
function expa_decode_attributes( $attributes = array(), $stringified_values = array() ) {
	foreach( $stringified_values as $key ) {
		if ( array_key_exists( $key, $attributes ) && 'string' === gettype($attributes[$key]) && !empty( $attributes[$key] ) ) {
			$value = json_decode( $attributes[$key], true ) !== null ? json_decode( $attributes[$key], true ) : false;
			if ( $value ){
				$attributes[$key] = $value;
			} else {
				unset( $attributes[$key] );
			}
		}
	}
	return $attributes;
}

?>