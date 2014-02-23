<?php
$data = array(
  'ID' => $post->ID,
  'record_author_ID' => $post->post_author,
  'created_date_local' => $post->post_date,
  'created_date_gmt' => $post->post_date_gmt,
  'record_title' => $post->post_title,
  'record_name' => $post->post_name,
  'record_status' => $post->post_status,
  'modified_date_local' => $post->post_modified,
  'modified_date_gmt' => $post->post_modified_gmt,
  'record_type' => $post->post_type
);
$post_content = json_decode($post->post_content);

if(!empty($post_content)){
  foreach($post_content as $key => $value){
    $data[$key] = $value;
  }
}else{
  $data['record_content'] = $post->post_content;
  $data['record_content_html'] = apply_filters('the_content', $post->post_content);
}

echo json_encode($data);
