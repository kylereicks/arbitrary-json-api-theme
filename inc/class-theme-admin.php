<?php
if(!class_exists('Theme_Admin')){
  class Theme_Admin{
    public static function init(){
      add_action('init', array('Theme_Admin', 'remove_tinymce'));
      add_action('edit_form_after_title', array('Theme_Admin', 'editor_setup'));
      add_action('admin_enqueue_scripts', array('Theme_Admin', 'register_scripts'));
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
      echo '<textarea name="content" id="content" style="display: none;">' . $post->post_content . '</textarea>';
      echo '<div id="json-editor"></div>';
      wp_enqueue_script('admineditor');
    }

    public static function register_scripts(){
      wp_register_script('jsoneditor', get_template_directory_uri() . '/js/libs/jsoneditor/jsoneditor-min.js', array(), '2.3.6', true);
      wp_register_style('jsoneditor', get_template_directory_uri() . '/js/libs/jsoneditor/jsoneditor-min.css', array(), '2.3.6', 'all');
      wp_register_script('admineditor',get_template_directory_uri() .  '/js/admin-editor.min.js', array('jsoneditor'), THEME_VERSION, true);
      wp_enqueue_style('jsoneditor');
    }

  }
}
