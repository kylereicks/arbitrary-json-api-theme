<?php
/*
 * From Roots Theme
 * https://github.com/roots/roots/blob/master/lib/wrapper.php
 */
if(!class_exists('Theme_Template_Wrapper')){
  class Theme_Template_Wrapper{
    public static $main_template_file_path;
    public static $template_file_base_name;
    public $slug;
    public $templates;

    public function __construct($template = 'base.php'){
      $this->slug = basename($template . '.php');
      $this->templates = array($template);

      if(self::$template_file_base_name){
        array_unshift($this->templates, sprintf($this->slug . '-%s.php', self::$template_file_base_name));
      }
    }

    public function __toString(){
      $this->templates = apply_filters('theme_template_wrapper_' . $this->slug, $this->templates);
      return locate_template($this->templates);
    }

    static function wrap($main_template_file_path){
      self::$main_template_file_path = $main_template_file_path;
      self::$template_file_base_name = basename(self::$main_template_file_path, '.php');

      if('index' === self::$template_file_base_name){
        self::$template_file_base_name = false;
      }

      return new self();
    }
  }
}
