;(function(window, document, $, Backbone, _, undefined){
  var Item = Backbone.Model.extend({
    defaults: {
      itemId: '',
      buttons: [
        'object',
        'array',
        'string',
        'color',
        'map',
        'tinymce',
        'image'
      ],
      type: 'string',
      parentId: '0',
      parentType: 'object',
      level: 0,
      order: 0,
      key: '',
      value: ''
    },

    initialize: function(){
      if(!this.get('itemId')){
        this.set({itemId: this.cid});
      }else{
        this.cid = this.get('itemId');
      }
    }
  });

  var List = Backbone.Collection.extend({
    model: Item,
    comparator: function(item){
      return [item.get('level'), item.get('order')];
    }
  });

  var ItemView = Backbone.View.extend({
    tagName: 'li',
    template: null,

    events: {
      'click span.delete': 'remove',
      'change input': 'updateModel',
      'click button.select-image': 'selectImage'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'removeTree', 'remove', 'updateModel', 'selectImage', 'updateOrder');

      $(this.el).attr('id', this.model.get('itemId'));
      this.template = _.template($('#' + this.model.get('parentType') + '-' + this.model.get('type')).html());
      if('string' === this.model.get('type') || 'tinymce' === this.model.get('type') || 'image' === this.model.get('type') || 'color' === this.model.get('type') || 'map' === this.model.get('type')){
        this.model.set({buttons: []});
      }
      this.buttons = this.getButtonsHtml(this.model.get('buttons'));

      this.model.bind('remove', this.unrender);
      this.model.bind('updateModel', this.updateModel);
    },

    getButtonsHtml: function(buttonsArray){
      var html = '';
      _(buttonsArray).each(function(buttonName){
        html += $('#button-add-' + buttonName).html();
      });
      return html ? '<span class="plus-icon"></span>' + html : html;
    },

    render: function(){
      var self = this;
      this.$el.html(this.template(this.model.toJSON()) + this.buttons);
      this.$el.children('ul, ol').sortable({
        update: function(e, ui){
          self.updateOrder();
        },
        stop: function(e, ui){
          self.$el.find('textarea').each(function(){
            var $textarea = $(this);
            if($textarea.hasClass('wp-editor-area')){
              tinyMCE.execCommand('mceAddEditor', true, $textarea.attr('id'));
            }
          });
        },
        start: function(e, ui){
          self.$el.find('textarea').each(function(){
            var $textarea = $(this),
            editorContent = '';
            if($textarea.hasClass('wp-editor-area')){
              editorContent = tinyMCE.activeEditor.getContent();
              tinyMCE.execCommand('mceRemoveEditor', false, $textarea.attr('id'));
              $textarea.val(editorContent);
            }
          });
        },
        handle: '.sort-handle'
      });
      return this;
    },

    unrender: function(){
      $(this.el).remove();
    },

    updateOrder: function(){
      _(this.model.collection.models).each(function(model){
        model.set({order: $('li#' + model.get('itemId')).index()});
      }, this);
    },

    removeTree: function(model){
      _(model.collection.where({parentId: model.get('itemId')})).each(function(item){
        this.removeTree(item);
      }, this);
      model.destroy();
    },

    remove: function(){
      this.removeTree(this.model);
    },

    selectImage: function(e){
      e.preventDefault();
      e.stopPropagation();

      var self = this,
      mediaModal = wp.media();

      mediaModal.on('select', function(){
        var selection = mediaModal.state().get('selection'),
        output = [];
        selection.each(function(attachment){
          output.push(attachment.attributes);
        });
        self.model.set({value: output});
        self.$el.find('.image-preview').attr('src', output[0].sizes.thumbnail.url);
      });

      mediaModal.open();
    },

    updateModel: function(e){
      switch(this.model.get('type')){
        case 'string':
        case 'object':
        case 'array':
          this.model.set({key: this.$el.find('.key').val(), value: this.$el.find('.value').val()});
          break;
        case 'image':
        case 'color':
        case 'map':
        case 'tinymce':
          this.model.set({key: this.$el.find('.key').val()});
          break;
      }
    }
  });

  var ListView = Backbone.View.extend({
    el: $('#content-json-editor'),

    events: {
      'click button.add-item': 'addItem'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem', 'updateContent', 'updateOrder');

      var self = this;

      if($('#content').val()){
        this.collection = new List(JSON.parse($('#content').val()));
      }else{
        this.collection = new List();
      }
      this.collection.bind('add', this.appendItem);
      this.collection.bind('change reset add remove', this.updateContent);

      this.render();

      this.$el.children('ul, ol').sortable({
        update: function(e, ui){
          self.updateOrder();
        },
        stop: function(e, ui){
          self.$el.find('textarea').each(function(){
            var $textarea = $(this);
            if($textarea.hasClass('wp-editor-area')){
              tinyMCE.execCommand('mceAddEditor', true, $textarea.attr('id'));
            }
          });
        },
        start: function(e, ui){
          self.$el.find('textarea').each(function(){
            var $textarea = $(this),
            editorContent = '';
            if($textarea.hasClass('wp-editor-area')){
              editorContent = tinyMCE.activeEditor.getContent();
              tinyMCE.execCommand('mceRemoveEditor', false, $textarea.attr('id'));
              $textarea.val(editorContent);
            }
          });
        },
        handle: '.sort-handle'
      });
    },

    render: function(){
      var self = this;
      $(this.el).append(this.getButtonsHtml(Object.getPrototypeOf(this.collection).model.prototype.defaults.buttons));
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){
        self.appendItem(item);
      }, this);
    },

    getButtonsHtml: function(buttonsArray){
      var html = '';
      _(buttonsArray).each(function(buttonName){
        html += $('#button-add-' + buttonName).html();
      });
      return html ? '<span class="plus-icon"></span>' + html : html;
    },

    addItem: function(e){
      e.preventDefault();
      var parentModel = 'LI' === e.target.parentElement.tagName ? this.collection.findWhere({itemId: e.target.parentElement.id}) : false,
      item = new Item({
        type: e.target.className.match(/item-([^\s]+)/)[1],
        parentId: parentModel ? parentModel.get('itemId') : '0',
        parentType: parentModel ? parentModel.get('type') : 'object',
        level: parentModel ? parentModel.get('level') + 1 : 0,
      });
      this.collection.add(item);
    },

    appendItem: function(item){
      var itemView = new ItemView({
        model: item
      }),
      map = null,
      marker = null,
      initialLatLng = null;
      if('0' !== item.get('parentId')){
        $('#' + item.get('parentId') + '>ul, #' + item.get('parentId') + '>ol').append(itemView.render().el);
      }else{
        this.$el.children('ul').append(itemView.render().el);
      }
      item.set({order: itemView.$el.index()});
      itemView.$el.find('.color-picker').wpColorPicker({
        change: function(e, ui){
          item.set({value: ui.color.toString()});
        }
      });
      if(itemView.$el.find('div.map').hasClass('map')){
        initialLatLng = itemView.$el.find('div.map').attr('data-latLng') ? itemView.$el.find('div.map').attr('data-latLng').replace(/[()]/g, '').split(', ') : '44.97022530459223, -93.289053440094'.split(', ');
        map = new google.maps.Map(itemView.$el.find('div.map')[0], {
          center: new google.maps.LatLng(initialLatLng[0], initialLatLng[1]),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 10
        });
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(initialLatLng[0], initialLatLng[1]),
          map: map,
          draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function(e){
          item.set({value: marker.getPosition().toString()});
        }, false);
      }
      if(itemView.$el.find('textarea').hasClass('wp-editor-area')){
        if(typeof tinymce !== 'undefined'){
          try{
            tinyMCE.init({
              theme: 'modern',
              skin: 'lightgray',
              language: 'en',
              resize: 'vertical',
              formats: {
                alignleft: [{
                  selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li',
                  styles: {
                    textAlign: 'left'
                  }
                },
                {
                  selector: 'img,table,dl.wp-caption',
                  classes: 'alignleft'
                }],
                aligncenter: [{
                  selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li',
                  styles: {
                    textAlign: 'center'
                  }
                },
                {
                  selector: 'img,table,dl.wp-caption',
                  classes: 'aligncenter'
                }],
                alignright: [{
                  selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li',
                  styles: {
                    textAlign: 'right'
                  }
                },
                {
                  selector: 'img,table,dl.wp-caption',
                  classes: 'alignright'
                }],
                strikethrough: {
                  inline: 'del'
                }
              },
              relative_urls: false,
              remove_script_host: false,
              convert_urls: false,
              browser_spellcheck: true,
              fix_list_elements: true,
              entities: '38,amp,60,lt,62,gt',
              entity_encoding: 'raw',
              menubar: false,
              keep_styles: false,
              paste_remove_styles: true,
              preview_styles: 'font-family font-size font-weight font-style text-decoration text-transform',
              wpeditimage_disable_captions: false,
              plugins: 'charmap,hr,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview',
              content_css: 'http://localhost/Wordpress-Development/api/wp-includes/css/dashicons.min.css?ver=3.9-beta2,http://localhost/Wordpress-Development/api/wp-includes/js/mediaelement/mediaelementplayer.min.css?ver=3.9-beta2,http://localhost/Wordpress-Development/api/wp-includes/js/mediaelement/wp-mediaelement.css?ver=3.9-beta2,http://localhost/Wordpress-Development/api/wp-includes/js/tinymce/skins/wordpress/wp-content.css?ver=3.9-beta2',
              selector: '#' + item.get('itemId') + '-tinymce',
              wpautop: true,
              indent: false,
              toolbar1: 'bold,italic,strikethrough,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,fullscreen,wp_adv',
              toolbar2: 'formatselect,underline,alignjustify,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
              toolbar3: '',
              toolbar4: '',
              tabfocus_elements: ':prev,:next',
              body_class: item.get('itemId') + '-tinymce',
              elements: 'none',
              setup: function(editor){
                editor.on('change', function(e){
                  item.set({value: editor.getContent()});
                });
              }
            });
            if(!window.wpActiveEditor){
              window.wpActiveEditor = item.get('itemId') + '-tinymce';
            }
          }catch(e){}
        }
        if(typeof quicktags !== 'undefined'){
          try{
            quicktags({
              id: item.get('itemId') + '-tinymce',
              buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,more,close'
            });
            if(!window.wpActiveEditor){
              window.wpActiveEditor = item.get('itemId') + '-tinymce';
            }
          }catch(e){}
        }
        if(typeof jQuery !== 'undefined'){
          jQuery('.wp-editor-wrap').on('click.wp-editor', function(){
            if(this.id){
              window.wpActiveEditor = this.id.slice(3, -5);
            }
          });
        }
      }
    },

    updateOrder: function(){
      _(this.collection.models).each(function(model){
        model.set({order: $('li#' + model.get('itemId')).index()});
      }, this);
    },

    updateContent: function(e){
      this.collection.sort();
      $('#content').val(JSON.stringify(this.collection));
    }
  });

  var listView = new ListView();
}(this, document, jQuery, Backbone, _));
