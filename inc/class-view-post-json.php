<?php
if(!class_exists('View_Post_JSON')){
  class View_Post_JSON{
    private $collection = null;
    private $data = array();
    public $json = null;

    public function __construct($post){
      $this->data['ID'] = $post->ID;
      $this->data['record_author_ID'] = $post->post_author;
      $this->data['created_date_local'] = $post->post_date;
      $this->data['created_date_gmt'] = $post->post_date_gmt;
      $this->data['record_title'] = $post->post_title;
      $this->data['record_name'] = $post->post_name;
      $this->data['record_status'] = $post->post_status;
      $this->data['modified_date_local'] = $post->post_modified;
      $this->data['modified_date_gmt'] = $post->post_modified_gmt;
      $this->data['record_type'] = $post->post_type;

      $this->collection = json_decode($post->post_content);

      if(!empty($this->collection)){
        foreach($this->collection as $model){
          if(0 == $model->level){
            $this->data[$model->key] = $this->handle_data_type($model);
          }
        }
      }else{
        $this->data['record_content'] = $post->post_content;
        $this->data['record_content_html'] = apply_filters('the_content', $post->post_content);
      }

      $this->json = json_encode($this->data);
    }

    private function get_object_data($parent){
      $object_data = array();
      foreach($this->collection as $model){
        if($parent->itemId === $model->parentId){
          $object_data[$model->key] = $this->handle_data_type($model);
        }
      }
      return $object_data;
    }

    private function get_array_data($parent){
      $array_data = array();
      foreach($this->collection as $model){
        if($parent->itemId === $model->parentId){
          $array_data[] = $this->handle_data_type($model);
        }
      }
      return $array_data;
    }

    private function handle_data_type($model){
      switch($model->type){
      case 'string':
        return $model->value;
        break;
      case 'object':
        return $this->get_object_data($model);
        break;
      case 'array':
        return $this->get_array_data($model);
        break;
      }
    }
  }
}
