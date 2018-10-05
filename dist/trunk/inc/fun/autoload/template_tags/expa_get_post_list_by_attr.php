<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
die;
}

/**
 * Get a list of post_attr values (for one key) with associated posts
 *
 * @param string		$attr_key			the attribute key
 * @param array			$extra_classes		array of strings. Additional wrapper classes
 *
 * @return string		$list
 */
function expa_get_post_list_by_attr( $attr_key = null, $extra_classes = array() ) {
	if ( null === $attr_key )
		return false;

	global $posts;


	// wrapper open
	$wrapper_classes = array( 'expa-post-attr-list' );
	$wrapper_classes = array_merge( $wrapper_classes, $extra_classes );
	$html_arr = array(
		'<ul class="' . implode( ' ', $wrapper_classes ) . '">',
	);

	// structure posts, get an array of years with associated posts
	$years_with_posts = expa_structure_posts_by_post_attr_key( $posts, $attr_key );

	// loop years
	foreach( $years_with_posts as $year => $year_posts ) {

		// year_row open
		$year_row = array(
			'<li class="expa-post-attr-list-row">',
				'<div class="expa-post-attr-label">',
					$year,
				'</div>',
				'<div class="expa-post-attr-posts">',
					'<ul class="expa-post-attr-posts-list">',
		);

		// loop posts
		foreach( $year_posts as $year_post ) {
			$post_link = get_post_permalink( $year_post );

			$post_element = array(
				'<li class="expa-post-attr-posts-list-item">',
					'<a href="' . esc_url( get_post_permalink( $year_post ) ) . '" rel="bookmark">',
						$year_post->post_title,
					'</a>',
				'</li>',
			);

			// append post_element to year_row
			$year_row = array_merge( $year_row, $post_element );
		}

		// year_row close
		$year_row[] = '</ul>';	// close	expa-post-attr-posts-list
		$year_row[] = '</div>';	// close	expa-post-attr-posts
		$year_row[] = '</li>';	// close	expa-post-attr-list-row

		// append year_row to html_arr
		$html_arr = array_merge( $html_arr, $year_row );

	}

	// wrapper close
	$html_arr[] = '</ul>';		// close	expa-post-attr-list

	$list = implode( '', $html_arr );
	return $list;

}
