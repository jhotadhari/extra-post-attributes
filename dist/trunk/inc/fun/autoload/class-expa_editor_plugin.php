<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Expa_Editor_Plugin {

	protected static $instance = null;

	protected $handles = array(
		'editor' => 'expa_editor_plugin',
		'frontend' => 'expa_editor_plugin_frontend',
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

	/**
	 * Initiate our hooks
	 * @since 0.0.1
	 */
	protected function hooks() {
		// add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ), 10, 0 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_editor_assets' ), 10, 0 );
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

	/*
	public function enqueue_frontend_assets(){

		$handle = $this->get_handle( 'frontend' );

		// wp_register_script(
		// 	$handle,
		// 	Expa_Extra_post_attributes::plugin_dir_url() . '/js/' . $handle . '.min.js',
		// 	array(
		// 		'wp-api',
		// 		'wp-i18n',
		// 	),
		// 	false,
		// 	true
		// );

		// wp_localize_script( $handle, 'expa_sculpture_plugin_data', $this->get_localize_data() );

		// wp_enqueue_script( $handle );

		// wp_register_style(
		// 	$handle,
		// 	Expa_Extra_post_attributes::plugin_dir_url() . '/css/' . $handle . '.min.css',
		// 	array(
		// 		'dashicons',
		// 	)
		// );
		// wp_enqueue_style( $handle );
	}
	*/

	/**
	 * Register script/style
	 * @since 0.0.1
	 */
	public function enqueue_editor_assets(){

		/**
		 * Returns an array of post_type keys for which the plugin is enabled
		 *
		 * @since 0.0.1
		 *
		 * @param array		$post_types		Post Type keys
		 */
		$post_types = apply_filters( 'expa_post_types', expa_get_post_types( 'array_keys', array() ) );
		$screen = get_current_screen();
		if ( 'post' !== $screen->base || ! in_array( $screen->post_type, $post_types ) )
			return;

		$handle = $this->get_handle( 'editor' );

		wp_register_script(
			$handle,
			Expa_Extra_post_attributes::plugin_dir_url() . '/js/' . $handle . '.min.js',
			array(
				'wp-i18n',
				'underscore',
				'wp-edit-post',
			),
			false,
			true
		);

		wp_localize_script( $handle, 'expaData', $this->get_localize_data() );

		wp_enqueue_script( $handle );

		wp_register_style(
			$handle,
			Expa_Extra_post_attributes::plugin_dir_url() . '/css/' . $handle . '.min.css'
		);
		wp_enqueue_style( $handle );
	}

}

function expa_editor_plugin() {
	return Expa_Editor_Plugin::get_instance();
}
expa_editor_plugin();

?>