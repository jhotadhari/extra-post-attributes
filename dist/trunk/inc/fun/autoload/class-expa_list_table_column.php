<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Expa_List_Table_Column {

	protected static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}
		return self::$instance;
	}

	public function hooks() {
		add_filter( 'manage_posts_columns' , array( $this, 'custom_columns' ) );
		add_action( 'manage_posts_custom_column' , array( $this, 'custom_columns_data' ), 10, 2 );
	}

	public function custom_columns( $columns ) {
		// we don't need to check the screen, because we did it prior initializing

		$insert_after = 'title';

		if ( ! array_key_exists( $insert_after, $columns ) )
			throw new Exception( 'Key to insert after not found' );

		$newColumns = array();
		foreach ( $columns as $key => $value ) {
			$newColumns[$key] = $value;
			if ( $key === $insert_after ) {
				$newColumns['expa'] = __( 'Extra Attributes' );
			}
		}

		return $newColumns;
	}

	public function custom_columns_data( $column, $post_id ) {
		switch ( $column ) {
		case 'expa':
			echo Expa_Block::get_instance()->render( array(
				'postId' 	=> $post_id,
				'args' 		=> json_encode( array(
					'include'	=> array(
						'all' => true,
					),
					'exclude'	=> array(
						'emptyKeys' => false,
						'emptyValues' => true,
						'keys'	=> array(),
					),
					'formatting'	=> array(
						'general'	=> array(
							'format' => 'list',
							'separator' => ',',
							'showLabel' => true,
							'valueFormat' => 'characterSeparated',
							'valueSeparator' => '/',
						),
						'byKey'	=> array(),
					)
				) ),
			), '' );
			break;
		}
	}
}

// initialize
function expa_list_table_column( $screen ) {

	$post_types = apply_filters( 'expa_list_table_column_post_types',
		apply_filters( 'expa_post_types', expa_get_post_types( 'array_keys', array() ) )
	);

	if ( ( ! in_array( $screen->post_type, $post_types ) ) || 'edit' !== $screen->base )
		return;

	return Expa_List_Table_Column::get_instance();
}
add_action( 'current_screen', 'expa_list_table_column' );

?>