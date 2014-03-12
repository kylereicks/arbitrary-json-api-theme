;(function(window, document, $, Backbone, _, undefined){
  var Item = Backbone.Model.extend({
    defaults: {
      itemId: '',
      buttons: '<button class="add-item item-object">+ {}</button><button class="add-item item-array">+ []</button><button class="add-item item-string">+ string</button><button class="add-item item-image">+ image</button>',
      type: 'string',
      parentId: '0',
      parentType: 'object',
      level: 0,
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
    comparator: 'level'
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
      _.bindAll(this, 'render', 'unrender', 'remove', 'updateModel', 'selectImage');

      $(this.el).attr('id', this.model.get('itemId'));
      this.template = _.template($('#' + this.model.get('parentType') + '-' + this.model.get('type')).html());
      if('string' === this.model.get('type') || 'image' === this.model.get('type')){
        this.model.set({buttons: ''});
      }

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
      this.model.bind('updateModel', this.updateModel);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()) + this.model.get('buttons'));
      return this;
    },

    unrender: function(){
      $(this.el).remove();
    },

    remove: function(){
      _(this.model.collection.where({parentId: this.model.get('itemId')})).each(function(){
        this.unrender();
        this.model.collection.remove(this.model);
      }, this);
      this.model.collection.remove(this.model);
    },

    selectImage: function(e){
      e.preventDefault();

      var self = this,
      mediaModal = wp.media();

      mediaModal.on('select', function(){
        var selection = mediaModal.state().get('selection'),
        output = [];
        selection.each(function(attachment){
          output.push(attachment.attributes);
        });
        self.model.set({value: output});
      });
      mediaModal.open();
    },

    updateModel: function(e){
      switch(this.model.get('type')){
        case 'string':
        case 'object':
        case 'array':
          this.model.set({key: this.$el.find('input.key').val(), value: this.$el.find('input.value').val()});
          break;
        case 'image':
          this.model.set({key: this.$el.find('input.key').val()});
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
      _.bindAll(this, 'render', 'addItem', 'appendItem', 'updateContent');

      if($('#content').val()){
        this.collection = new List(JSON.parse($('#content').val()));
      }else{
        this.collection = new List();
      }
      this.collection.bind('add', this.appendItem);
      this.collection.bind('change reset add remove', this.updateContent);

      this.render();
    },

    render: function(){
      var self = this;
      $(this.el).append('<button class="add-item item-object">+ {}</button><button class="add-item item-array">+ []</button><button class="add-item item-string">+ string</button><button class="add-item item-image">+ image</button>');
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){
        self.appendItem(item);
      }, this);
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
      });
      if('0' !== item.get('parentId')){
        $('#' + item.get('parentId') + '>ul, #' + item.get('parentId') + '>ol').append(itemView.render().el);
      }else{
        $('ul', this.el).append(itemView.render().el);
      }
    },

    updateContent: function(){
      $('#content').val(JSON.stringify(this.collection));
    }
  });

  var listView = new ListView();
}(this, document, jQuery, Backbone, _));
