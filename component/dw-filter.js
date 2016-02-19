// dwFilter
(function( $ ){

    // Public methods
    var api = {
      init : function(options) {
        var $el = $(this);
        // deploy component structure
        methods.deployComponent($el, options);
      },
      destroy: function(){
        var $el = $(this);
        $el.empty();
        $el.removeClass('dw-filter');
      },
      val: function($el){
        if($el === null ){
          $el = $(this);
        }
        var type = $el.data('type');

        // builds each modified object
        switch(type) {
          case 'checkbox':
            return methods.valCheckbox($el);
          case 'selectChain':
            return methods.valSelectChain($el);
          case undefined:
            return 'No type defined in this $el data';
          default:
            return 'This type not exist';
        }
      }
    };

    // Private methods
    var methods = {
      deployComponent: function($el, options){
        // convert the div into a dw-filter component
        $el.addClass('dw-filter');
        // get filter template
        methods.getTemplate($el, options);
      },
      getTemplate: function($el, options){
        $.get("./component/templates/dw-filter.html", function( result ) {
          templateContent = result;
          methods.setTemplate($el, templateContent, options);
        });
      },
      setTemplate : function($el, templateContent, options){
        var titleVal = '';
        var template;
        if (typeof options !== 'undefined') {
          if (typeof options.title === 'undefined') {
            titleVal = '';
          }else{
            titleVal = options.title;
          }
          template = _.template(templateContent);
          $el.html( template({titleVal: titleVal}) );
        }else{
          template = _.template(templateContent);
          $el.html( template({titleVal: ''}) );
          $el.find('content').css('display','none');
        }

        if (typeof options !== 'undefined') {
          // inject options according to filter type
          methods.setOptionTemplate($el, options);
          // show search input
          methods.showSearch($el, options);
          // init events
          events.start($el, options);
        }

      },
      setOptionTemplate: function($el, options){
        switch(options.type) {
          case 'checkbox':
            methods.checkboxTemplate($el, options);
            break;
          case 'selectChain':
            methods.selectChainTemplate($el, options);
            break;
          case 'fromTo':
            methods.fromToTemplate($el, options);
            break;
          default:
            console.log(options.type + ": is not a valid type, or not have a template.");
            break;
        }
      },
      checkboxTemplate: function($el, options){
        $el.data({
          type: options.type
        });
        var key = options.config.key_attr;
        var value = options.config.value_attr;

        $.get("./component/templates/checkbox.html", function( result ) {
          var template = _.template(result);
          $.each(options.data, function(i, data){
            var contentHtml = template({
              key: data[key],
              value: data[value]
            });
            $el.find('.dw-options').append(contentHtml);
          });

          // events for checkboxes
          events.checkboxes($el);
        });
      },
      selectChainTemplate: function($el, options){
        $el.data({
          type: options.type
        });
        var key = options.config.key_attr;
        var name = options.config.name_attr;
        var value = options.config.value_attr;

        $.get("./component/templates/selectChain.html", function( result ) {
          var template = _.template(result);
          $.each(options.data, function(i, data){
            var contentHtml = template({
              key: data[key],
              name: data[name],
              value: data[value]
            });
            $el.find('.dw-options').append(contentHtml);
          });
          // events for selectChain
          events.selectChain($el, options);
        });
      },
      fromToTemplate: function($el, options){
        console.log("Template fromTo");
      },
      showSearch: function($el, options){
        var $search = $el.find('.search input');
        if( options.search == 'inner' || options.search == 'outer' ){
          $search.toggleClass('hide');
        }
      },
      valCheckbox: function($el){
        var result = {
          search: '',
          data: []
        };
        var $options = $el.find('.dw-options');
        $.each($options.find('.dw-option') , function(i, opt){
          var $opt = $(opt);
          var $optInput = $opt.find('input');
          if( $optInput.is(':checked') ){
            // arm
            result.data.push($opt.data('value'));
          }
        });
        // outerSearch
        var outerSearch = methods.getOuterSearch($el);
        if(typeof outerSearch !== 'undefined'){
          result.search = outerSearch;
        }
        // update $el data
        $el.data("result", result);
        methods.passResult($el);
        return result;
      },
      valSelectChain: function($el){
        var result = {
          search: '',
          data: []
        };
        var $options = $el.find('.dw-options');
        // options
        $.each($options.find('.dw-option') , function(i, opt){
          var $opt = $(opt);
          var $optInput = $opt.find('select');

          var content = function(){
            if($optInput.val() == 'undefined' || $optInput.val() == 'none'){
              return null;
            }else{
              return parseInt( $optInput.val() );
            }
          }();

          result.data.push({
            name: $opt.attr('title'),
            content: content
          });
        });

        // outerSearch
        var outerSearch = methods.getOuterSearch($el);
        if(typeof outerSearch !== 'undefined'){
          result.search = outerSearch;
        }
        // update $el data
        $el.data("result", result);
        this.passResult($el);
        return result;
      },
      innerSearch: function($el, inputData, options){
        methods.hideOptions($el, inputData, options);
      },
      outerSearch: function($el, inputData, options){
        $el.data({
          dataSearch: inputData
        });
      },
      getOuterSearch: function($el){
        var dataSearch = $el.data('dataSearch');
        return dataSearch;
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
      },
      passResult: function($el){
        $el.trigger('change');
      }
    };

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
            switch(options.search){
              case 'inner':
                methods.innerSearch($el, inputData, options);
                break;
              case 'outer':
                methods.outerSearch($el, inputData, options);
                break;
            }
            if(options.search == 'outer'){
              api.val($el);
            }
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
      checkboxes: function($el){
        $el.find('input').on({
          change: function(event){
            api.val($el);
          }
        });
      },
      selectChain: function($el){
        $el.find('select').on({
          change: function(event){
            api.val($el);
          }
        });
      }
    };

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
