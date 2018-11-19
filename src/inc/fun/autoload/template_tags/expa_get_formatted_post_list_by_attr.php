<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
die;
}

/**
 * Get a list of post_attr values (for one key) with associated posts
 *
 * @param string		$attr_key			the attribute key
 * @param array			$args				????		array of strings. Additional wrapper classes
 *
 * @return string		$list
 */
function expa_get_formatted_post_list_by_attr( $attr_key = null, $args = array() ) {
	if ( null === $attr_key )
		return false;

	global $posts;

	$default_args = array(
		'item_wrapper_extra_classes'	=> array(),
		'item_wrapper_tag_name'   		=> 'ul',
		'item_set_id'			=> false,
		'item_extra_classes'	=> array(),
		'item_tag_name'   		=> 'li',
		'item_parts'			=> array(
			'title',
			// 'thumbnail',
			// 'description',
			// 'tax_category',
			// 'more_button',
		),
		'item_part_config'	=> array(
			'title'   		=> array(),
			'thumbnail'   	=> array(),
			'description' 	=> array(),
			'more_button'  	=> array(),
		),

	);

	$args = wp_parse_args( $args, $default_args );

	// wrapper open
	$wrapper_classes = array( 'expa-post-attr-list' );
	$wrapper_classes = array_merge( $wrapper_classes, $args['item_wrapper_extra_classes'] );
	$html_arr = array(
		'<ul class="' . implode( ' ', $wrapper_classes ) . '">',
	);

	// structure posts, get an array of keys with associated posts
	$keys_with_posts = expa_structure_posts_by_post_attr_key( $posts, $attr_key );

	// loop keys_with_posts
	foreach( $keys_with_posts as $key => $items ) {

		// key_row open
		$key_row = array(
			'<li class="expa-post-attr-list-row">',
				'<div class="expa-post-attr-label">',
					$key,
				'</div>',
				'<div class="expa-post-attr-posts">',
					'<' . $args['item_wrapper_tag_name'] . ' class="expa-post-attr-posts-list">',
		);

		// loop posts
		foreach( $items as $item ) {
			$item_id = $item->ID;
			$item_link = get_permalink( $item );
			$item_link = apply_filters( 'expa_item_link', $item_link, $item );
			$item_link = $item_link === false || is_wp_error( $item_link ) ? false : esc_url( $item_link );
			$item_name = $item->post_title;
			$item_link_element_open = $item_link ? '<a href="' . $item_link . '" title="' . $item_name . '" rel="bookmark" title="' . esc_html( $item_name ) . '">' : '';
			$item_classes = array( 'expa-post-attr-posts-list-item' );
			$item_classes = array_merge( $item_classes, $args['item_extra_classes'] );

			// the item markup array
			$item_elements_arr = array(
				'<' . $args['item_tag_name'] . ' class="' . implode( ' ', $item_classes ) . '"' . ( $args['item_set_id'] ? 'id="post-' . $item_id . '"': '' ) . '>',
			);
			foreach( $args['item_parts'] as $item_part ) {
				switch( $item_part ) {
					case 'title':
						$item_elements_arr = array_merge( $item_elements_arr, array(
							'<div class="expa-post-attr-posts-list-item-title-wrapper">',
								// '<h2>',
									$item_link_element_open ? $item_link_element_open : '',
									$item_name,
									$item_link_element_open ? '</a>' : '',
								// '</h2>',
							'</div>',
						) );
						break;
					case 'thumbnail':
						$item_thumbnail = get_the_post_thumbnail( $item_id, 'medium_large', array(
							'class' => 'hover-scale',
							'title' => $item_name,
						) );
						if ( strlen( $item_thumbnail ) > 0 )
							$item_elements_arr = array_merge( $item_elements_arr, array(
								$item_link_element_open ? $item_link_element_open : '',
									'<div class="expa-post-attr-posts-list-item-thumbnail-wrapper">',
										$item_thumbnail,
									'</div>',
								$item_link_element_open ? '</a>' : '',
							) );
						break;
					case 'description':
						$item_description = $item->post_excerpt;
						if ( strlen( $item_description ) > 0 )
							$item_elements_arr = array_merge( $item_elements_arr, array(
								'<div class="expa-post-attr-posts-list-item-description">',
									$item_description,
								'</div>',
							) );
						break;
					case 'more_button':
						if ( $item_link && strlen( $item_link ) > 0 )
							$item_elements_arr = array_merge( $item_elements_arr, array(
								'<div class="expa-post-attr-posts-list-item-more wp-block-button alignright is-style-squared">',
									'<a href="' . $item_link . '" class="more-link float-right wp-block-button__link" rel="bookmark" title="' . esc_html( $item_name ) . '">',
										__( 'Continue reading','bier' ),
										'<span class="screen-reader-text">' . $item_name . '</span>',
									'</a>',
								'</div>',
							) );
						break;
					default:

						// expa support
						if ( strpos( $item_part, 'expa_') === 0 && function_exists( 'expa_get_formatted_post_attr' ) ) {


							$separator = expa_array_get( $args, 'item_part_config.' . $item_part . '.separator', ', ' );
							$show_label = expa_array_get( $args, 'item_part_config.' . $item_part . '.show_label', false );
							$after_label = expa_array_get( $args, 'item_part_config.' . $item_part . '.after_label', ': ' );

							$before = expa_array_get( $args, 'item_part_config.' . $item_part . '.before', '' );
							$after = expa_array_get( $args, 'item_part_config.' . $item_part . '.after', '' );

							$expa_key = substr( $item_part, 5 );
							$expa_values = expa_get_formatted_post_attr( $item, $expa_key, $separator, '<span>', '</span>' );
							if ( strlen( $expa_values ) > 13 ) {
								$item_elements_arr = array_merge( $item_elements_arr, array(
									'<div class="expa-post-attr-posts-list-item-expa">',
										$before,
										$show_label ? apply_filters( 'expa_pair_label_name', $expa_key, $item_id ) . $after_label : '',
										$expa_values,
										$after,
									'</div>',
								) );
							}
						}

						// tax support
						if ( strpos( $item_part, 'tax_') === 0 ) {
							$separator = expa_array_get( $args, 'item_part_config.' . $item_part . '.separator', ', ' );
							// $show_label = expa_array_get( $args, 'item_part_config.' . $item_part . '.show_label', true );
							$tax_slug = substr( $item_part, 4 );
							$terms = get_the_terms( $item_id, $tax_slug );

							$before = expa_array_get( $args, 'item_part_config.' . $item_part . '.before', '' );
							$after = expa_array_get( $args, 'item_part_config.' . $item_part . '.after', '' );

							if ( $terms && count( $terms ) > 0 ) {
								$label = $show_label
									? ( count( $terms ) === 1
										? get_taxonomy( $tax_slug )->labels->singular_name
										: get_taxonomy( $tax_slug )->labels->name )
									: false;
								$term_link_elements = array_map( function( $term ) use( $tax_slug ) {
									return '<a href="' . esc_url( get_term_link( $term, $tax_slug ) ) . '" rel="bookmark" title="' . esc_html( $term->name ) . '">' . $term->name . '</a>';
								}, $terms );
								$item_elements_arr = array_merge( $item_elements_arr, array(
									'<div class="expa-post-attr-posts-list-item-tax">',
										$before,
										$label ? $label . ': ' : '',
										implode( $separator, $term_link_elements ),
										$after,
									'</div>',
								) );
							}
						}

				}
			}
			$item_elements_arr[] = '</' . $args['item_tag_name'] . '>';





			// append post_element to key_row
			// $key_row = array_merge( $key_row, $post_element );
			$key_row = array_merge( $key_row, $item_elements_arr );
		}

		// key_row close
		$key_row[] = '</' . $args['item_wrapper_tag_name'] . '>';	// close	expa-post-attr-posts-list
		$key_row[] = '</div>';	// close	expa-post-attr-posts
		$key_row[] = '</li>';	// close	expa-post-attr-list-row

		// append key_row to html_arr
		$html_arr = array_merge( $html_arr, $key_row );

	}

	// wrapper close
	$html_arr[] = '</ul>';		// close	expa-post-attr-list

	$list = implode( '', $html_arr );
	return $list;

}
