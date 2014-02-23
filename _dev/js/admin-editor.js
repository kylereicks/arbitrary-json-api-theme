(function(window, document, $, undefined){
  var editorContainer = document.getElementById('json-editor'),
  $editorContainer = $('#json-editor'),
  $contentField = $('#content'),
  existingContent = $contentField.val(),
  editor = new jsoneditor.JSONEditor(editorContainer);

  if(existingContent){
    editor.set(JSON.parse(existingContent));
  }

  $editorContainer.on('blur keyup paste input', '[contenteditable]', function(){
    $contentField.val(JSON.stringify(editor.get()));
    return $(this);
  });

}(this, document, jQuery));
