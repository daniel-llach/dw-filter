// dwFilter
(function( $ ){

    // Public methods
    var api = {
      init : function(options) {
        var $el = $(this);
        // deploy component structure
        methods.deployComponent($el, options);
        // init events
        events.start($el, options);
      },
      destroy: function(){
        var $el = $(this);
        $el.empty();
        $el.removeClass('dw-filter');
      },
      val: function(){
        var $el = $(this);
        var type = $el.data('type');
        // builds each modified object
        switch(type) {
          case 'checkbox':
            return methods.valCheckbox($el);
            break;
        }
      }
    };

    // Private methods
    var methods = {
      deployComponent: function($el, options){
        // convert the div into a dw-filter component
        $el.addClass('dw-filter');
        // get filter template
        methods.setTemplate($el, options);
        // inject options according to filter type
        methods.setOptionTemplate($el, options);
        // show search input
        methods.showSearch($el, options);
      },
      setTemplate : function($el, options){
        $el.html('<header><div class="left">' + options.title + '</div><div class="right"><i class="icon-toggle open"></i></div></header><content><div class="search"><input type="text" name="search" id="dw-search" class="glass hide"></div><div class="dw-options"></div></content>');
      },
      setOptionTemplate: function($el, options){
        switch(options.type) {
          case 'checkbox':
            methods.setCheckboxTemplate($el, options);
            break;
        }
      },
      setCheckboxTemplate: function($el, options){
        var key = options.config['key_attr'];
        var value = options.config['value_attr'];
        $el.data({
          type: options.type
        });
        $.each(options.data, function(i, data){
          $el.find('.dw-options').append('<div class="dw-option" data-value="' + data[key] + '" data-content="' + data[value] + '"><input type="checkbox" name="' + data[value] + '" id="' + data[value] + '"><label for="' + data[value] + '">' + data[value] + '</label></div>');
        });
      },
      showSearch: function($el, options){
        var $search = $el.find('.search input');
        if( options.search == 'inner' ){
          $search.toggleClass('hide');
        }
      },
      valCheckbox: function($el){
        var result = [];
        var $options = $el.find('.dw-options');
        $.each($options.find('.dw-option') , function(i, opt){
          var $opt = $(opt);
          var $optInput = $opt.find('input');
          if( $optInput.is(':checked') ){
            // arm
            result.push($opt.data('value'));
          }
        });
        return result;
      }
    }

    // Events
    var events = {
      start: function($el, options){
        events.toggleContent($el, options);
        events.onSearch($el, options);
      },
      toggleContent: function($el, options){
        var $header = $el.find('header');
        var $content = $el.find('content');
        var $icon = $el.find('.icon-toggle');
        $header.on({
          click: function(){
            $content.slideToggle('fast', function(){
              if( $icon.hasClass('open') ){
                $icon.toggleClass('open');
                $icon.toggleClass('close');
              }else{
                $icon.toggleClass('open');
                $icon.toggleClass('close');
              }
            });
          }
        });
      },
      onSearch: function($el, options){
        var $search = $el.find('.search input');
        $search.on({
          keyup: function(event){
            var inputData = $search.val();
            events.hideOptions($el, inputData, options);
          },
          focus: function(event){
            $search.removeClass('glass');
          },
          focusout: function(event){
            if($search.val().length > 0){
              $search.removeClass('glass');
            }else{
              $search.addClass('glass');
            }
          }
        });

      },
      hideOptions: function($el, data, options){
        $.each($el.find('.dw-option') , function(i, opt){
          var $opt = $(opt);
          var temp = $opt.data('content');
          temp = temp.toLowerCase();
          data = data.toLowerCase();
          if( temp.indexOf(data) != -1 ) {
            $opt.show();
          }else{
            $opt.hide();
          }
        });
      }

    }


    // jquery component stuff
    $.fn.dwFilter = function(methodOrOptions) {
        if ( api[methodOrOptions] ) {
            return api[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return api.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.dwFilter' );
        }
    };

})( jQuery );
