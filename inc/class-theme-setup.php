<?php
if(!class_exists('Theme_Setup')){
  class Theme_Setup{

    public static function init(){
      add_action('after_setup_theme', array('Theme_Setup', 'load_theme_textdomain'));
      add_filter('template_include', array('Theme_Template_Wrapper', 'wrap'));
      Theme_Admin::init();
    }

    public static function load_theme_textdomain(){
      load_theme_textdomain(THEME_NAME, get_template_directory() . '/languages');
    }

  }
}
