<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Gets the value at path of array. If no resolved value, the defaultValue is returned
 *
 * @since 0.0.2
 *
 * @param array			$array		The array to query.
 * @param string		$path		'.' separated path of the property to get.
 * @return 							The resolved value
 */
function expa_array_get( $array, $path, $default = null ) {
	if ( ! is_array( $array ) )
		return $default;

	$path_arr = explode( '.', $path );

	if ( ! array_key_exists( $path_arr[0], $array ) || ! isset( $array[$path_arr[0]] ) )
		return $default;

	if ( 1 === count( $path_arr ) )
		return array_key_exists( $path_arr[0], $array ) || isset( $array[$path_arr[0]] ) ? $array[$path_arr[0]] : $default;

	if ( count( $path_arr ) > 1 && strlen( $path_arr[1] ) > 0 ){
		return is_array( $array[$path_arr[0]] )
			? expa_array_get(
				$array[$path_arr[0]],
				implode( '.', array_slice( $path_arr, 1 ) ),
				$default )
			: $default;
	}
}

