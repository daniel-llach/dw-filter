var scripts = document.getElementsByTagName("script");
var urlBase = scripts[scripts.length-1].src;
urlBase = urlBase.replace('dw-typeahead.js', '');

// dwFilter
(function( $ ){
  "use strict"

  // Public methods
  let api = {
    init : function(options) {
      const $el = $(this);
      // deploy component structure
      let deployment = new Promise(function(resolve, reject){
        methods.deployComponent($el, options);
        resolve()
      })
      deployment.then(function(){
        methods.getTemplate($el, options);
      })
    },
    destroy: function(){
      const $el = $(this);
      $el.empty();
      $el.removeClass('dw-typeahead');
    },
    val: function($el){
      (typeof $el === 'undefined' || $el === null ) ? $el = $(this) : null;
      methods.getVal($el);
    },
    restart: function($el){
      // previene cuando no hay input
      let $groups = $el.find('.options .group');
      let $groupsContent = $el.find('.options .group-content');
      $groups.show();
      $groupsContent.show();

      // previene cuando no hay input
      let $options = $el.find('.options .option');
      $options.show();

      // deselect
      $options.removeClass('selected')
      $el.data('result','')

    },
    empty: function($el){
      (typeof $el === 'undefined' || $el === null ) ? $el = $(this) : null;
      let $options = $el.find('content > .options');
      let $clear = $el.find('.clear');
      let $search = $el.find('#search');
      $options.addClass('hide');
      $clear.addClass('hide');
      $search.val('');  // clean text search
    }
  }

  // Private methods
  let methods = {

    deployComponent: function($el, options){
      // convert the div into a dw-filter component
      $el.addClass('dw-typeahead');
    },

    getTemplate: function($el, options){

      $.get(urlBase + "templates/dw-typeahead.html", function( result ) {
        let templateContent = result;
        methods.setTemplate($el, templateContent, options)
      });

    },

    setTemplate : function($el, templateContent, options){

      let template = _.template(templateContent);
      $el.html( template({
        'placeholder': options.placeholder
      }) );

      if (typeof options !== 'undefined') {
        methods.optionTemplate($el, options)
      } // Todo: falta cuando no trae contenido - $('#sample1').dwSelect()

    },
    optionTemplate: function($el, options){

      let data = options.data[0];

      // If has groups, paint groups containers
      if( data.hasOwnProperty('group') ){
        // define groups
        let groups =  _.chain(options.data).flatten().pluck('group').flatten().unique().value().sort();

        // paint groups containers
        _.each(groups, function(group){
          $el.find('content > .options').append('<div class="group" id="' + group + '"><div class="title"><span class="name">' + group + '</span><span class="open"></span></div></div><div class="group-content ' + group + '"></div>')
        })

        // put options into its group
        $.get(urlBase + "templates/options.html", function( result ) {
            let template = _.template(result);

            let data = _.sortBy(options['data'], 'primary');

            // options each
            data.forEach(data => {
              let contentHtml = template({
                id: data['id'],
                primary: data['primary'],
                secundary: data['secundary'],
                selected: data['selected']
              });
              // paint in specific group content
              let group = data['group'];
              $el.find('.' + group + '.group-content').append(contentHtml);
            });

            methods.setPosition($el);
            events.start($el, options);
          });

      }else{
        // no groups
        // put options into its group
        $.get(urlBase + "templates/options.html", function( result ) {
            let template = _.template(result);

            let data = _.sortBy(options['data'], 'primary');

            // options each
            options['data'].forEach(data => {
              let contentHtml = template({
                id: data['id'],
                primary: data['primary'],
                secundary: data['secundary'],
                selected: data['selected']
              });
              $el.find('content > .options').append(contentHtml);
            });

            methods.setPosition($el);
            events.start($el, options);
          });
      }

    },
    setPosition: function($el){
      let windowHeight = $(window).height();
      let scrollTop = methods.previousParentsScrollTop($el);
      let scrollLeft = methods.previousParentsScrollLeft($el);

      let contentWidth = $el.outerWidth();
      let elHeight = $el.offset().top
      let contentTop = elHeight + $el.height() - scrollTop;
      let contentLeft = $el.offset().left - scrollLeft;
      let contentHeight = $el.find('content').height();
      let headerHeight = $el.find('header').height();

      // vertical
      if(windowHeight - ( contentTop + contentHeight ) < 0 ){
        $el.find('content').css({
          top: contentTop - contentHeight + - headerHeight + 'px',
        })
      }else{
        $el.find('content').css({
          top: contentTop + 'px',
        })
      }
      // horizontal
      $el.find('content').css({
        width: contentWidth + 'px',
        left: contentLeft + 'px'
      })
    },
    previousParentsScrollTop: function($el){
      (function($) {
          $.fn.hasScrollBar = function() {
              return this.get(0).scrollHeight > this.height();
          }
      })(jQuery);

      let scroll;

      $el.parents().filter(function(){
        if( $(this).hasScrollBar() ){
          scroll = $(this).scrollTop();
          return
        }
      })

      return scroll;
    },
    previousParentsScrollLeft: function($el){
      (function($) {
          $.fn.hasScrollBar = function() {
              return this.get(0).scrollHeight > this.height();
          }
      })(jQuery);

      let scroll;

      $el.parents().filter(function(){
        if( $(this).hasScrollBar() ){
          scroll = $(this).scrollLeft();
          return
        }
      })

      return scroll;
    },
    getPreviousParentScroll: function($el){
      (function($) {
          $.fn.hasScrollBar = function() {
              return this.get(0).scrollHeight > this.height();
          }
      })(jQuery);

      let parentScroll;

      $el.parents().filter(function(){
        if( $(this).hasScrollBar() ){
          parentScroll = $(this);
          return
        }
      })

      return parentScroll;

    },
    hideOptions: function($el, inputData, options){

      if( options.data[0].hasOwnProperty('group') ){

        let firstLetter = inputData.charAt(0);
        (firstLetter != ':') ? methods.hideOption($el, inputData, options) : methods.hideGroups($el, inputData, options);

      }

    },
    hideOption: function($el, inputData, options){
      let $option = $el.find('.option').toArray();

      $option.forEach(opt => {

        const $opt = $(opt);
        let tempPrimary = $opt.find('.primary').text();
        let tempSecundary = $opt.find('.secundary').text();

        tempPrimary = tempPrimary.toLowerCase();
        tempSecundary = tempSecundary.toLowerCase();

        inputData = inputData.toLowerCase();

        ( tempPrimary.indexOf(inputData) != -1 || tempSecundary.indexOf(inputData) != -1 ) ? $opt.show() : $opt.hide();

      });

    },
    hideGroups: function($el, inputData, options){
      let $groups = $el.find('.options .group').toArray();

      $groups.forEach(grp => {
        const $grp = $(grp);
        let tempInput = $grp.find('.title .name').text()

        if ( inputData.indexOf(' ') != -1 ){
          let optTemp = inputData.split(' ');

          // groups

          optTemp[0] = optTemp[0].toLowerCase();
          optTemp[0] = optTemp[0].replace(':','');
          ( tempInput.indexOf(optTemp[0]) != -1 ) ? $grp.show() : $grp.hide();
          ( tempInput.indexOf(optTemp[0]) != -1 ) ? $grp.next().show() : $grp.next().hide();



          // options

          let $option = $el.find('.option').toArray();

          $option.forEach(opt => {

            const $opt = $(opt);
            let tempPrimary = $opt.find('.primary').text();
            let tempSecundary = $opt.find('.secundary').text();

            tempPrimary = tempPrimary.toLowerCase();
            tempSecundary = tempSecundary.toLowerCase();

            optTemp[1] = optTemp[1].toLowerCase();

            ( tempPrimary.indexOf(optTemp[1]) != -1 || tempSecundary.indexOf(optTemp[1]) != -1 ) ? $opt.show() : $opt.hide();

          });

        }else{

          tempInput = tempInput.toLowerCase();
          inputData = inputData.replace(':','');
          inputData = inputData.toLowerCase();
          ( tempInput.indexOf(inputData) != -1 ) ? $grp.show() : $grp.hide();
          ( tempInput.indexOf(inputData) != -1 ) ? $grp.next().show() : $grp.next().hide();
        }
      });

    },
    getVal: function($el){
      // update $el data
      let options = $el.find('.options .option.selected').toArray();
      let ids = [];
      for(let i in options){
        let $opt = $(options[i]);
        ids.push($opt.data('id'));
      }
      $el.data('result', ids);
      methods.passResult($el);
      return ids;
    },
    passResult: function($el){
      $el.trigger('change');
    },
    showSelected: function($el, $target, options){
      let $search = $el.find('.search input');
      let primaryContent = $( $target.parent() ).find('.primary').text();

      $search.val(primaryContent);
      $search.focus();

    }
  }


  // Events
  var events = {

    start: function($el, options){
      events.onSearch($el, options);
      events.clearSearch($el, options);
      events.clickOption($el, options);
      events.clickOut($el, options);
      events.updatePosition($el);
    },
    initOptions: function($el, options){
      let $option = $el.find('content > .options > .option');
      $option.removeClass('hide');
      $option.css({
        'display': 'block'
      })
    },
    toggleGroup: function($el, options){
    },
    onSearch: function($el, options){
      let $search = $el.find('.search input');
      let $options = $el.find('content > .options');
      let $clear = $el.find('.clear');

      $search.on({
        keyup: function(event){
          var inputData = $search.val();
          methods.hideOptions($el, inputData, options);

          // show/hide clear icon
          ($search.val().length > 0) ? $clear.removeClass('hide') : $clear.addClass('hide');
          $el.find('.options').removeClass('hide');
          methods.setPosition($el);
        },
        focus: function(event){
          // $search.removeClass('glass');

          $options.removeClass('hide');
          methods.setPosition($el);

          events.initOptions($el, options);

          // show/hide clear icon
          ($search.val().length > 0) ? $clear.removeClass('hide') : $clear.addClass('hide');
        },
        // focusout: function(event){
        //   // ($search.val().length > 0) ? $search.removeClass('glass') : $search.addClass('glass');
        //   $options.addClass('hide');
        // }
      });
    },
    clearSearch: function($el, options){
      let $search = $el.find('.search input');
      let $clear = $el.find('.clear');
      $clear.on({
        click: function(event){
          $search.val('');
          methods.hideOptions($el, $search.val(), options);
          ($search.val().length > 0) ? $clear.removeClass('hide') : $clear.addClass('hide');
          ($search.val().length > 0) ? $search.removeClass('glass') : $search.addClass('glass');

          // restart contents
          api.restart($el);
        }
      })
    },
    clickOption: function($el, options){
      let $options = $el.find('.options .option');
      let $search = $el.find('.search input');
      $options.on({
        click: function(event){
          event.preventDefault();
          event.stopPropagation();
          // mark as selected
          $options.removeClass('selected');
          $(event.target).parent().toggleClass('selected');
          api.val($el);
          // show selected option
          methods.showSelected( $el, $(event.target), options )
          // hide options
          $el.find('.options').addClass('hide');
        }
      })
    },
    clickOut: function($el, options){
      let $options = $el.find('content > .options');
      let $clear = $el.find('.clear');
      $(document).mouseup(function (e)
      {
          if (!$el.is(e.target) // if the target of the click isn't the $el...
              && $el.has(e.target).length === 0) // ... nor a descendant of the $el
          {
              $options.addClass('hide');
              $clear.addClass('hide')
          }
      });
    },
    updatePosition: function($el){
      let $parentScroll = methods.getPreviousParentScroll($el);
      $(document).on( 'scroll', $parentScroll[0].tagname, function(){
        methods.setPosition($el)
      });
    },

  };


  // jquery component stuff
  $.fn.dwTypeahead = function(methodOrOptions) {
      if ( api[methodOrOptions] ) {
          return api[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ))
      } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
          // Default to "init"
          return api.init.apply( this, arguments )
      } else {
          $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.dwTypeahead' )
      }
  };


})( jQuery )
