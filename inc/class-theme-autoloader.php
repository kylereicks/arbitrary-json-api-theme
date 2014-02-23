<?php
if(!class_exists('Theme_Autoloader')){
  class Theme_Autoloader{
    public $base_directory;

    public function __construct($dir = __DIR__){
      $this->base_directory = $dir;
      spl_autoload_register(array($this, register));
    }

    public function register($class_name){
      $file_path = $this->base_directory . '/class-' . strtolower(str_replace('_', '-', $class_name)) . '.php';
      if(is_readable($file_path)){
        require_once($file_path);
      }
    }
  }
}
