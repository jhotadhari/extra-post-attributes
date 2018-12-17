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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );	// could be enqueued on enqueue_block_assets but we need it for template_tags ascii2ebcdic well
	}

	public function register_block() {
		if ( function_exists( 'register_block_type' ) ) {
			register_block_type( $this->namspace, array(
				'editor_script' => $this->get_handle( 'editor' ),
				'editor_style' => $this->get_handle( 'editor' ),
				'style' => $this->get_handle( 'frontend' ),
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

	// protected function get_localize_data(){
	// 	return array();
	// }

	public function enqueue_frontend_assets() {

		if ( is_admin() || ! apply_filters( 'expa_enqueue_frontend_assets', true )  )
			return;

		$handle = $this->get_handle( 'frontend' );

		wp_enqueue_style(
			$handle,
			Expa_Extra_post_attributes::plugin_dir_url() . '/css/' . $handle . '.min.css',
			array(),
			filemtime( Expa_Extra_post_attributes::plugin_dir_path() . 'css/' . $handle . '.min.css' )
		);

	}

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

		// wp_localize_script( $handle, 'expaData', $this->get_localize_data() );
		wp_set_script_translations( $handle, 'expa', Expa_Extra_post_attributes::plugin_dir_path() . 'languages' );
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

		$format = expa_array_get( $attributes, 'args.formatting.general.format', 'list' );
		$tag_outer = 'div';
		$tag_inner = 'div';
		switch( $format ){
			case 'list':
				$tag_outer = 'ul';
				$tag_inner = 'li';
				break;
			// case 'nestedDivs':
			case 'inline':
				$tag_outer = 'span';
				$tag_inner = 'span';
				break;
		}

		$show_label = expa_array_get( $attributes, 'args.formatting.general.showLabel', true );
		$separator = expa_array_get( $attributes, 'args.formatting.general.separator', ', ' );

		$unique_pair_labels = array();
		foreach( $filtered_pairs as $pair ) {
			if ( ! in_array( $pair['key'], $unique_pair_labels ) )
				array_push( $unique_pair_labels, $pair['key']);
		}

		// wrapper open
		$html_arr = array(
			'<div class="expa-block">',
				'<' . $tag_outer . '>',
		);

		foreach( $unique_pair_labels as $index => $pair_label ) {
			/**
			 * Filter the label name
			 * eg: translate it
			 *
			 * @param string		$label_name
			 * @param int			$post_id
			 * @return string
			 */
			$label_name = apply_filters( 'expa_pair_label_name', $pair_label, $post_id, $attributes['args'] );
			$html_arr = array_merge( $html_arr, array(
				'<' . $tag_inner . '>',
					$show_label && strlen( $label_name ) > 0 ? '<span>' . $label_name . ': </span>' : '',
					expa_get_formatted_values_by_label( $post_id, $filtered_pairs, $pair_label, $attributes['args'] ),

					'inline' === $format && count( $unique_pair_labels ) - 1 > $index ? '<span>' . $separator .'</span>' : '',

				'</' . $tag_inner . '>',
			) );
		}

		// wrapper close
		$html_arr = array_merge( $html_arr, array(
				'</' . $tag_outer . '>',
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