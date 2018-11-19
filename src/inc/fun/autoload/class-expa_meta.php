<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Expa_Meta {

	/**
	 * Holds an instance of the object
	 *
	 * @var Expa_Meta
	 * @since 0.0.1
	 */
	protected static $instance = null;

	protected $fields;

	/**
	 * Returns the running object
	 *
	 * @return Expa_Meta
	 * @since 0.0.1
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 * @since 0.0.1
	 */
	protected function __construct() {
	}

	/**
	 * Initiate our hooks
	 * @since 0.0.1
	 */
	public function hooks() {
		add_action( 'init', array( $this, 'set_fields' ) );
		add_action( 'rest_api_init', array( $this, 'api_register_meta' ) );
	}

	public function set_fields() {

		$fields = array();

		array_push( $fields, array(
			'title' => array(
				'key' => 'expa_post_atts',
				'val' => 'Type',
			),
			'schema' => array(
				'type' => 'string',
			),
		) );

		$this->fields = $fields;
	}

	public function get_fields() {
		return is_array( $this->fields ) ? $this->fields : array();
	}

	public function api_register_meta(){

		$fields = $this->fields;

		/**
		 * Returns an array of post_type keys for which the plugin is enabled
		 *
		 * @since 0.0.1
		 *
		 * @param array		$post_types		Post Type keys
		 */
		$post_types = apply_filters( 'expa_post_types', expa_get_post_types( 'array_keys', array() ) );

		if ( ! empty( $fields ) ) {
			foreach( $fields as $field ){
				if ( array_key_exists( 'title', $field ) && ! empty( $field['title'] ) ){
					if ( array_key_exists( 'key', $field['title'] ) && ! empty( $field['title']['key'] ) ){

						$schema = array();
						$schema['description'] = $field['title']['val'];
						$schema['context'] =  array( 'view', 'edit' );
						$schema['type'] = $field['schema']['type'];

						foreach( $post_types as $post_type ) {
							register_rest_field(
								$post_type,
								$field['title']['key'],
								array(
									'get_callback'      => array( $this, 'api_field_get_cb' ),
									'update_callback'   => array( $this, 'api_field_update_cb' ),
									'schema'            => $schema
								)
							);
						}
					}
				}
			}
		}
	}

	public function api_field_get_cb( $object, $field_name, $request ) {
		return get_post_meta( $object['id'], sanitize_key( $field_name ), true );
	}

	public function api_field_update_cb( $value, $object, $field_name ) {
		switch( $field_name ) {
			case 'expa_post_atts':
				// string serialized objects
				$value = json_decode( $value, true ) !== null ? json_decode( $value, true ) : $value;
				return update_post_meta( $object->ID, $field_name, $value );
				break;
			// case '_example_string':
			// 	// string string number
			// 	return update_post_meta( $object->ID, $field_name, $value );
			// 	break;
			default:
				return false;
		}
	}

}

function expa_meta() {
	return Expa_Meta::get_instance();
}
expa_meta();

?>