<?php
if(!class_exists('Theme_Admin')){
  class Theme_Admin{
    public static function init(){
      add_action('init', array('Theme_Admin', 'remove_tinymce'));
      add_action('edit_form_after_title', array('Theme_Admin', 'editor_setup'));
      add_action('admin_enqueue_scripts', array('Theme_Admin', 'register_scripts'));
      add_action('admin_enqueue_scripts', array('Theme_Admin', 'register_styles'));
    }

    public static function remove_tinymce(){
      global $_wp_post_type_features;
      foreach($_wp_post_type_features as $post_type => $settings){
        if(!in_array($post_type, array('attachment', 'revision'))){
          remove_post_type_support($post_type, 'editor');
        }
      }
    }

    public static function editor_setup(){
      global $post;

      $field_types = array(
        'button-add-object',
        'button-add-array',
        'button-add-string',
        'button-add-image',
        'button-add-color',
        'button-add-map',
        'button-add-tinymce',
        'object-object',
        'object-array',
        'object-image',
        'object-string',
        'object-color',
        'object-map',
        'object-tinymce',
        'array-object',
        'array-array',
        'array-image',
        'array-color',
        'array-map',
        'array-tinymce',
        'array-string'
      );
      foreach($field_types as $template_name){
        self::include_backbone_template($template_name);
      }
      echo '<div id="content-json-editor"></div>';
      echo '<textarea name="content" id="content">' . $post->post_content . '</textarea>';
      wp_enqueue_script('content-json-editor');
    }

    public static function register_scripts(){
      wp_register_script('google-maps-api', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDXY8vH-GMJZCciFB6dOweDmKH-RwX7iCM&sensor=false', array(), THEME_VERSION, true);
      wp_register_script('tinymce', includes_url() .  'js/tinymce/tinymce.js', array(), false, true);
      wp_register_script('tinymce-plugins', includes_url() .  'js/tinymce/plugins/compat3x/plugin.min.js', array('tinymce'), false, true);
      wp_register_script('content-json-editor', get_template_directory_uri() .  '/js/content-json-editor.min.js', array('jquery', 'backbone', 'underscore', 'jquery-ui-sortable', 'google-maps-api', 'wp-color-picker', 'word-count', 'editor', 'quicktags', 'wplink', 'wp-fullscreen', 'media-upload', 'tinymce', 'tinymce-plugins'), THEME_VERSION, true);
    }

    public static function register_styles(){
      wp_register_style('content-json-editor', get_template_directory_uri() .  '/css/content-json-editor.css', array('wp-color-picker', 'dashicons', 'editor-buttons', 'buttons', 'mediaelement', 'wp-mediaelement', 'media-views', 'imgareaselect', 'thickbox'), THEME_VERSION, 'all');
      wp_enqueue_style('content-json-editor');
    }

    private static function include_backbone_template($template_name){
      echo '<script type="text/template" id="' . $template_name . '">';
      get_template_part('templates/backbone/' . $template_name);
      echo '</script>';
    }
  }
}
