<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Expa_defaults {


	protected $defaults = array();

	public function add_default( $arr ){
		$defaults = $this->defaults;
		$this->defaults = array_merge( $defaults , $arr);
	}
	
	public function get_default( $key ){
		if ( array_key_exists($key, $this->defaults) ){
			return $this->defaults[$key];

		}
			return null;
	}


}

function expa_init_defaults(){
	global $expa_defaults;
	
	$expa_defaults = new Expa_defaults();
	
	// $defaults = array(
	// 	// silence ...
	// );
	
	// $expa_defaults->add_default( $defaults );	
}
add_action( 'admin_init', 'expa_init_defaults', 1 );
add_action( 'init', 'expa_init_defaults', 1 );



?>