<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Expa_Block {

	protected static $instance = null;
	protected $namspace = 'expa/extra-post-attributes';

	protected $handles = array(
		'editor' => 'expa_block_editor',
		'frontend' => 'expa_block_frontend',
	);

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}

		return self::$instance;
	}

	protected function __construct() {
		// ... silence
	}

	public function hooks() {
		add_action( 'init', array( $this, 'register_block' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		// add_action( 'enqueue_block_assets', array( $this, 'enqueue_frontend_assets' ) );
	}

	public function register_block() {
		if ( function_exists( 'register_block_type' ) ) {
			register_block_type( $this->namspace, array(
				'editor_script' => $this->get_handle( 'editor' ),
				'editor_style' => $this->get_handle( 'editor' ),
				// 'style' => $this->get_handle( 'frontend' ),
				// 'script' => $this->get_handle( 'frontend' ),
				'render_callback' => array( $this, 'render' ),
			) );
		}
	}

	protected function get_handle( $key ){
		$handles = $this->handles;
		if ( array_key_exists( $key, $handles ) ){
			return $handles[$key];
		}

	}

	protected function get_localize_data(){
		return array(
			'locale' => gutenberg_get_jed_locale_data( 'expa' ),
		);
	}

	// public function enqueue_frontend_assets() {

	// 	// check if we are on frontend
	// 	if ( is_admin() )
	// 		return;

	// 	$handle = $this->get_handle( 'frontend' );

	// 	wp_enqueue_style(
	// 		$handle,
	// 		Expa_Extra_post_attributes::plugin_dir_url() . '/css/' . $handle . '.min.css',
	// 		array( 'wp-blocks' ),
	// 		filemtime( Expa_Extra_post_attributes::plugin_dir_path() . 'css/' . $handle . '.min.css' )
	// 	);

	// 	wp_register_script(
	// 		$handle,
	// 		Expa_Extra_post_attributes::plugin_dir_url() . '/js/' . $handle . '.min.js',
	// 		array(
	// 			// 'wp-backbone',
	// 			// 'wp-api',
	// 			// 'utils',
	// 			),
	// 		filemtime( Expa_Extra_post_attributes::plugin_dir_path() . 'js/' . $handle . '.min.js' )
	// 	);

	// 	wp_localize_script( $handle, 'expaData', $this->get_localize_data() );

	// 	wp_enqueue_script( $handle );
	// }

	// hooked on enqueue_block_editor_assets. So function will only run in admin
	public function enqueue_editor_assets() {
		$handle = $this->get_handle( 'editor' );


		wp_register_script(
			$handle,
			Expa_Extra_post_attributes::plugin_dir_url() . '/js/' . $handle . '.min.js',
			array(
				'wp-blocks',
				'wp-i18n',
				'wp-element',
				'wp-edit-post',
			),
			filemtime( Expa_Extra_post_attributes::plugin_dir_path() . 'js/' . $handle . '.min.js' )
		);

		wp_localize_script( $handle, 'expaData', $this->get_localize_data() );

		wp_enqueue_script( $handle );

		wp_enqueue_style(
			$handle,
			Expa_Extra_post_attributes::plugin_dir_url() . '/css/' . $handle . '.min.css',
			array( 'wp-edit-blocks' ),
			filemtime( Expa_Extra_post_attributes::plugin_dir_path() . 'css/' . $handle . '.min.css' )
		);
	}

	public function render( $attributes, $content ) {
		if ( ! array_key_exists( 'postId', $attributes ) || empty( $attributes['postId'] ) )
			return '';
		$post_id = $attributes['postId'];

		$attributes = expa_decode_attributes( $attributes, array(
			'args',
		) );

		$expa_post_atts = get_post_meta( $post_id, 'expa_post_atts', true );
		$pairs = expa_array_get( $expa_post_atts, 'pairs', array() );
		$filtered_pairs = expa_get_filtered_pairs( $post_id, $pairs, $attributes['args'] );

		// wrapper open
		$html_arr = array(
			'<div class="expa-block">',
				'<ul>',
		);

		foreach( $filtered_pairs as $pair ) {
			$label_name = $pair['key'];
			/**
			 * Filter the label name
			 * eg: translate it
			 *
			 * @param string		$label_name
			 * @param array			$pair
			 * @param int			$post_id
			 * @return string
			 */
			$label_name = apply_filters( 'expa_pair_label_name', $label_name, $pair, $post_id, $attributes['args'] );
			$html_arr = array_merge( $html_arr, array(
				'<li>',
					strlen( $label_name ) > 0 ? '<span>' . $label_name . ': </span>' : '',
					expa_get_formatted_values_by_label( $post_id, $filtered_pairs, $pair['key'], $attributes['args'] ),
				'</li>',
			) );
		}

		// wrapper close
		$html_arr = array_merge( $html_arr, array(
				'</ul>',
			'</div>',
		) );

		return implode( '', $html_arr );
	}

}

function expa_block() {
	return Expa_Block::get_instance();
}

expa_block();

?>