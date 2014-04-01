<span class="sort-handle clearfix"><span class="screen-reader-text">Drag to sort</span></span>
<div id="wp-<%= itemId %>-tinymce-wrap" class="wp-core-ui wp-editor-wrap tmce-active">
  <div id="wp-<%= itemId %>-tinymce-editor-tools" class="wp-editor-tools hide-if-no-js">
    <div id"wp-<%= itemId %>-tinymce-media-buttons" class="wp-media-buttons">
      <a href="#" id="insert-media-button" class="button insert-media add_media" data-editor="<%= itemId %>-tinymce" title="Add Media"><span class="wp-media-buttons-icon"></span> Add Media</a>
    </div>
    <div class="wp-editor-tabs">
      <a id="<%= itemId %>-tinymce-html" class="wp-switch-editor switch-html" onclick="switchEditors.switchto(this);">Text</a>
      <a id="<%= itemId %>-tinymce-tmce" class="wp-switch-editor switch-tmce" onclick="switchEditors.switchto(this);">Visual</a>
    </div>
  </div>
  <div id="wp-<%= itemId %>-tinymce-editor-container" class="wp-editor-container">
    <textarea id="<%= itemId %>-tinymce" class="value wp-editor-area" rows="5" autocomplete="off" cols="30" name="<%= itemId %>-tinymce"><%= value %></textarea>
  </div>
</div>
<span class="delete"><span class="screen-reader-text">delete</span></span>
