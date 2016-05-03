
// dwFilter
(function( $ ){
  var scripts = document.getElementsByTagName("script");
  var urlBase = scripts[scripts.length-1].src;
  urlBase = urlBase.replace('dw-filter.js', '');

  "use strict";

  let localstore;

    // Public methods
    let api = {
      init : function(options) {
        const $el = $(this);
        if(!options.select){
          // deploy component structure
          let deployment = new Promise(function(resolve, reject){
            methods.deployComponent($el, options);
            resolve();
          });
          deployment.then(function(){
            methods.getTemplate($el, options);
          });
        }else{
          api.select($el, options)
        }
      },
      destroy: function(){
        const $el = $(this);
        $el.find('.selectedItems').dwList('destroy');
        $el.find('#choose').dwTypeahead('destroy');
        $el.empty();
        $el.removeClass('dw-filter');
      },
      val: function($el){
        (typeof $el === 'undefined' || $el === null ) ? $el = $(this) : null;
        const type = $el.data('type');
        // builds each modified object
        switch(type) {
          case 'checkbox':
            return methods.valCheckbox($el);
          case 'selectChain':
            return methods.valSelectChain($el);
          case 'multiselect':
            return methods.valMultiselect($el);
          case undefined:
            return 'No type defined in this $el data';
          default:
            return 'This type not exist';
        }
      },
      select: function($el, options){
        (typeof $el === 'undefined' || $el === null ) ? $el = $(this) : null;
        const type = $el.data('type');
        // builds each modified object
        switch(type) {
          case 'checkbox':
            return methods.selectCheckbox($el, options);
          case 'selectChain':
            return methods.selectSelectChain($el, options);
          case 'multiselect':
            return methods.selectMultiselect($el, options);
          case undefined:
            return 'No type defined in this $el data';
          default:
            return 'This type not exist';
        }
      }
    };

    // Private methods
    let methods = {
      deployComponent: function($el, options){
        // convert the div into a dw-filter component
        $el.addClass('dw-filter');
      },
      getTemplate: function($el, options){
        $.get(urlBase + "templates/dw-filter.html", function( result ) {
          let templateContent = result;
          methods.setTemplate($el, templateContent, options);
        });
      },
      setTemplate : function($el, templateContent, options){
        let titleVal = '';
        let template;
        if (typeof options !== 'undefined') {
          (typeof options.title === 'undefined') ? titleVal = '' : titleVal = options.title;
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
          // set height
          (typeof options.height !== 'undefined') ? methods.setHeight($el, options) : null;
          // init events
          events.start($el, options);
        }

      },
      setOptionTemplate: function($el, options){
        methods.overflow($el, options);
        switch(options.type) {
          case 'multiselect':
            methods.multiselectTemplate($el, options);
            break;
          case 'checkbox':
            methods.checkboxTemplate($el, options);
            break;
          case 'selectChain':
            methods.selectChainTemplate($el, options);
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
        const key = options.config.key_attr;
        const value = options.config.value_attr;

        $.get(urlBase + "templates/checkbox.html", function( result ) {
          let template = _.template(result);
          // load component template
          options['data'].forEach(data => {
            let contentHtml = template({
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

        const key = options.config.key_attr;
        const name = options.config.name_attr;
        const value = options.config.value_attr;

        $.get(urlBase + "templates/selectChain.html", function( result ) {
          let template = _.template(result);
          options['data'].forEach(data => {
            let contentHtml = template({
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
      multiselectTemplate: function($el, options){
        $el.data({
          type: options.type
        });

        // data key, value
        const placeholder = options.config.key_value_placeholder;
        const data = options.config.key_data_attr;

        $.get(urlBase + "templates/multiselect.html", function( result ){
          let template = _.template(result);
          let contentHtml = template();
          // content structure
          $el.find('.dw-options').append(contentHtml);

          // localstore
          localstore = options.data[0][data];
          localstore = _.uniq(localstore);

          // init dw-typeahead
          methods.initDwTypeahead($el, options.data[0][placeholder]);

          // events for multiselect
          events.multiselect($el, options);
        });
      },
      initDwTypeahead: function($el, placeholder){
        $el.find('.choose').dwTypeahead({
          placeholder: placeholder,
          data: localstore
          // data: []
        })
      },
      showSearch: function($el, options){
        let $search = $el.find('.search input');
        ( options.search == 'inner' || options.search == 'outer' ) ? $search.toggleClass('hide') : null;
      },
      setHeight: function($el, options){
        let $options = $el.find('.dw-options');
        let heightVal = options.height;
        if(heightVal == 'auto'){
          $options.css({
            height: 'auto'
          });
        }else if(heightVal.indexOf('px') >= 0 || heightVal.indexOf('px') >= 0){
          $options.css({
            height: options.height
          });
        }
      },
      valCheckbox: function($el){
        let result = {
          search: '',
          data: []
        };
        let $options = $el.find('.dw-options');
        let $option = $options.find('.dw-option');
        // options
        $option.toArray().forEach(opt => {
          const $opt = $(opt);
          let $optInput = $opt.find('input');
          ( $optInput.is(':checked') ) ? result.data.push($opt.data('value')) : null;
        });

        // outerSearch
        let outerSearch = methods.getOuterSearch($el);
        if(typeof outerSearch !== 'undefined'){
          result.search = outerSearch;
        }
        // update $el data
        $el.data("result", result);
        methods.passResult($el);
        return result;
      },
      valMultiselect: function($el){
        let result = {
          search: '',
          data: []
        };
        let $options = $el.find('.dw-options');
        let $option = $options.find('.dw-list > content > .items > .item');

        $option.toArray().forEach(opt => {
          const $opt = $(opt);
          result.data.push($opt.data('id'));
        });

        // update $el data
        $el.data("result", result);
        methods.passResult($el);
        return result;
      },
      valSelectChain: function($el){
        let result = {
          search: '',
          data: []
        };
        let $options = $el.find('.dw-options');
        let $option = $options.find('.dw-option');
        // options
        $option.toArray().forEach(opt => {
          const $opt = $(opt);
          let $optInput = $opt.find('select');

          let content = function(){
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
        let outerSearch = methods.getOuterSearch($el);
        (typeof outerSearch !== 'undefined') ? result.search = outerSearch : null;
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
        let dataSearch = $el.data('dataSearch');
        return dataSearch;
      },
      hideOptions: function($el, data, options){
        let $option = $el.find('.dw-option').toArray();
        $option.forEach(opt => {
          const $opt = $(opt);
          let temp = $opt.data('content');
          temp = temp.toLowerCase();
          data = data.toLowerCase();
          ( temp.indexOf(data) != -1 ) ? $opt.show() : $opt.hide();
        });
      },
      passResult: function($el){
        $el.trigger('changeFilter');
      },
      overflow: function($el, options){
        if(options.overflow == false){
          $el.find('.dw-options').css({
            'overflow-y': 'visible'
          })
        }
      },
      selectMultiselect: function($el, options){
        methods.passValMultiselect($el, options.select);
      },
      passValMultiselect: function($el, ids){
        let $choose = $el.find('.choose');
        let $selected = $el.find('.selectedItems');

        let componentData = api.val($el);
        let status = componentData.data;

        let addObjects = [];
        let removeObjects = [];
        let addIds = [];
        let removeIds = [];

        // subsets
        let intersection = _.intersection(status, ids);
        console.log("intersection: ", intersection);

        if(ids.length == 0){
          // if no ids clean dw-list and add
          // the selected items back to the dw-typeahead
          for(let i=0;i<status.length;i++){
            // get data item by id from localstore
            let itemData = _.where(localstore, {id: status[i]});
            // preparing obj to add
            let dataObj = {};
            dataObj.id = itemData[0].id;
            dataObj.primary = itemData[0].primary;
            dataObj.secundary = itemData[0].secundary;
            dataObj.selected = itemData[0].selected;
            // if has group add it
            (itemData[0].hasOwnProperty('group')) ? dataObj.group = itemData[0].group : '';
            // push changed items
            addObjects.push(dataObj);
            removeIds.push(dataObj.id);
          }
        }else{
          // add if it's not intersection
          // and not in the localstore
          for(let i=0;i<ids.length;i++){
            if( !_.contains(intersection, ids[i]) ){

              if( !_.contains(status, ids[i]) ){
                // get item data from localstore
                let itemData2 = _.where(localstore, {id: ids[i]});
                // push changed item
                addIds.push({
                  id: itemData2[0].id,
                  primary: itemData2[0].primary
                });
                removeObjects.push({
                  id: itemData2[0].id
                })

              }
            }
          }
          // remove if it's not intersection
          // and not in the new ids array
          for(let i=0;i<status.length;i++){
            if( !_.contains(intersection, ids[i]) ){
              if( !_.contains(ids, status[i]) ){
                console.log("no lo contiene el nuevo array, hay que quitarlo");

                // get data item by id from localstore
                let itemData = _.where(localstore, {id: status[i]});
                // preparing obj to add
                let dataObj = {};
                dataObj.id = itemData[0].id;
                dataObj.primary = itemData[0].primary;
                dataObj.secundary = itemData[0].secundary;
                dataObj.selected = itemData[0].selected;
                // if has group add it
                (itemData[0].hasOwnProperty('group')) ? dataObj.group = itemData[0].group : '';
                // push changed items
                addObjects.push(dataObj);
                removeIds.push(dataObj.id);
              }
            }
          }
        }


        // luego de tener todo hacer operacion final de añadir y luego borrar
        let adds = new Promise(function(resolve, reject){
          (addObjects.length > 0) ? methods.addTypeaheadItems($choose, addObjects) : '';
          (addIds.length > 0) ? methods.addListItems($selected, addIds) : '';
          resolve();
        })
        adds.then(function(){
          (removeObjects.length > 0) ? methods.removeTypeaheadItems($choose, removeObjects) : '';
          (removeIds.length > 0) ? methods.removeListItems($selected, removeIds) : '';
        })

      },
      addTypeaheadItems: function($choose, items){
        $choose.dwTypeahead({ add: items })
      },
      removeTypeaheadItems: function($choose, items){
        $choose.dwTypeahead({ delete: items });
        $choose.dwTypeahead('empty');
      },
      addListItems: function($selected, ids){
        $selected.dwList({ add: ids })
      },
      removeListItems: function($selected, ids){
        $selected.dwList({ delete: ids })
      },
      guidGenerator: function() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      }
    };

    // Events
    var events = {
      start: function($el, options){
        events.toggleContent($el, options);
        events.onSearch($el, options);
      },
      toggleContent: function($el, options){
        let $header = $el.find('header');
        let $content = $el.find('content');
        let $icon = $el.find('.icon-toggle');
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
        let $search = $el.find('.search input');
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
            ($search.val().length > 0) ? $search.removeClass('glass') : $search.addClass('glass');
          }
        });
      },
      checkboxes: function($el){
        $el.find('input').on({
          change: function(event){
            event.preventDefault();
            event.stopPropagation();
            api.val($el);
          }
        });
      },
      selectChain: function($el){
        $el.find('select').on({
          change: function(event){
            event.preventDefault();
            event.stopPropagation();
            api.val($el);
          }
        });
      },
      multiselect: function($el){
        // getChoose
        let $choose = $el.find('.choose');
        let $add = $el.find('.add');

        // init dw-list
        let $selected = $el.find('.selectedItems');
        $selected.dwList({
          name: methods.guidGenerator(),  // create an random id
          type: 'order', // priority, order, change
          style: 'naked',
          sortable: true,
          data: []
        })

        $add.on({
          click: function(event){
            event.preventDefault();
            event.stopPropagation();
            let $choose = $el.find('.choose');
            let $selected = $el.find('.selectedItems');
            let ids = $choose.data('result');

            // get item data from localstore
            let itemData3 = _.where(localstore, {id: ids[0]});
            // push changed item
            methods.addListItems($selected, [{
              id: itemData3[0].id,
              primary: itemData3[0].primary
            }]);
            methods.removeTypeaheadItems($choose, [{
              id: itemData3[0].id
            }])

          }
        })


        // listen change and item remove on dw-list
        $selected.on({
          change: function(event){
            event.preventDefault();
            event.stopPropagation();
            api.val($el);
          },
          delete: function(event, item){
            event.preventDefault();
            event.stopPropagation();
            // get data item by id from localstore
            // methods.passValMultiselect($el, [item]);

            let itemData = _.where(localstore, {id: item});
            // preparing obj to add
            let dataObj = {};
            dataObj.id = itemData[0].id;
            dataObj.primary = itemData[0].primary;
            dataObj.secundary = itemData[0].secundary;
            dataObj.selected = itemData[0].selected;
            // if has group add it
            (itemData[0].hasOwnProperty('group')) ? dataObj.group = itemData[0].group : '';

            let $choose = $el.find('.choose');
            methods.addTypeaheadItems($choose, [dataObj]);


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
