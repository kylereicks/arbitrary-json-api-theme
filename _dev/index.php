<?php
echo '[';
  if(!have_posts()):
    get_template_part('templates/nothing');
  endif;

  ob_start();
  while(have_posts()) : the_post();
    get_template_part('templates/content', 'data');
    echo ',';
  endwhile;
    echo trim(ob_get_clean(), ',');
echo ']';
