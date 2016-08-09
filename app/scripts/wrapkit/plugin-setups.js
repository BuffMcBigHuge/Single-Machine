(function(){
    'use strict';
    var WrapkitUtils = window.WrapkitUtils;

    // slim scroll
    [].forEach.call(document.querySelectorAll('[data-toggle="slimScroll"]'), function(el){
        WrapkitUtils.initSlimScroll($(el));
    });

    // propagation and prevented event
    $(document).on( 'click', '.stop-propagation', function(e){
        e.stopPropagation();
    })
        .on( 'click', '.prevent-default', function(e){
            e.preventDefault();
        });

    // BOOTSTRAP INPUT GROUP IN
    $( document ).on( 'focus', '.input-group-in .form-control', function(){
        var group = $(this).parent();

        if ( group.hasClass( 'twitter-typeahead' ) ) {
            group.parent().addClass( 'focus' );
        }
        else if( group.hasClass( 'input-group-in' ) ){
            group.addClass( 'focus' );
        }
    })
        .on( 'blur', '.input-group-in .form-control', function(){
            var group = $(this).parent();

            if ( group.hasClass( 'twitter-typeahead' ) ) {
                group.parent().removeClass( 'focus' );
            }
            else if( group.hasClass( 'input-group-in' ) ){
                group.removeClass( 'focus' );
            }
        });

    // END BOOTSTRAP INPUT GROUP IN// HELPER FOR CUSTOM SELECT
    $( document ).on( 'focus', 'label.select > select', function(){
        $(this).parent().addClass( 'focus' );
    }).on( 'focusout', 'label.select > select', function(){
        $(this).parent().removeClass( 'focus' );
    });



    // manual load template setups
    $('#templateSetup')
        .find('.modal-content')
        .load('_includes/setups.html', function(){
            var handler = $('[data-target="#templateSetup"]'),
                dataScripts = handler.data( 'scripts' ),
                scripts = (dataScripts) ? dataScripts.replace(/\s+/g, '') : false;

            if (scripts) {
                scripts = scripts.split( ',' );
                $.each( scripts, function(i, val){
                    WrapkitUtils.createScript(val);
                });
            }
        });



    // BOOTSTRAP TOOLTIPS
    $('[rel*="tooltip"], [data-toggle*="tooltip"]').each( function(){
        var $tip = $(this),
            data = $tip.data(),
            context = ( data.context ) ? 'tooltip-' + data.context : 'default';

        data.template = '<div class="tooltip '+ context +'"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

        $tip.tooltip( data );
    });

    // Trigger on other element
    $( '[data-toggle*="tooltip"][data-trigger-input], [rel*="tooltip"][data-trigger-input]' ).each( function(){
        var $tip = $( this ),
            data = $tip.data(),
            target = data.triggerInput;

        $( document ).on( 'focus', target, function(){
            $tip.tooltip('show');
        })
            .on( 'focusout', target, function(){
                $tip.tooltip('hide');
            });
    });

    // destroy a tooltip (helper)
    $('.disable-tooltip').tooltip('destroy');
    // END BOOTSTRAP TOOLTIPS



    // BOOTSTRAP POPOVER
    $('[rel*="popover"], [data-toggle*="popover"]').each(function(){
        var $pop = $(this),
            data = $pop.data(),
            context = ( data.context ) ? 'popover-' + data.context : 'default';
        data.template = '<div class="popover ' + context + '"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>';

        $pop.popover( data );
    });

    // Trigger on other element
    $( '[data-toggle*="popover"][data-trigger-input], [rel*="popover"][data-trigger-input]' ).each( function(){
        var $pop = $( this ),
            data = $pop.data(),
            target = data.triggerInput;

        $( document ).on( 'focus', target, function(){
            $pop.popover('show');
        })
            .on( 'focusout', target, function(){
                $pop.popover('hide');
            });
    });

    // destroy a popover (helper)
    $('.disable-popover').popover('destroy');
    // END BOOTSTRAP POPOVER



    // BOOTSTRAP MODAL
    $( document ).on( 'loaded.bs.modal', '.modal', function( e ){
        var targetID = e.target.id,
            handler = $('[data-target="#' + targetID + '"]'),
            dataScripts = handler.data( 'scripts' ),
            scripts = ( dataScripts ) ? dataScripts.replace(/\s+/g, '') : false;

        if( scripts ){
            scripts = scripts.split( ',' );
            $.each( scripts, function( i, val ){
                WrapkitUtils.createScript( val );
            });
        }
    })
        .on( 'hide.bs.modal', '.modal', function () {
            // hidden open popover
            $( document ).find( '[data-toggle=popover], [rel*=popover]' ).popover('hide');
        })
        // to support modal stackable
        .on( 'shown.bs.modal', function(e){
            var $modalBackdrop = $( 'body > .modal-backdrop' ),
                isStackable = ($modalBackdrop.length > 1) ? true : false;

            if ( isStackable ) {
                var zIndex = parseInt( $modalBackdrop.first().css( 'z-index' ) );

                $modalBackdrop.each( function(){
                    var $backdrop = $( this );

                    if(! $backdrop.is(':first') ){
                        zIndex = parseInt( $backdrop.css( 'z-index' ) );
                    }
                    if(! $backdrop.is(':last') ){
                        $backdrop.next().css( 'z-index', zIndex + 10 );
                    }
                });

                var lastZindex = parseInt( $modalBackdrop.last().css('z-index') );
                $( e.target ).css( 'z-index', lastZindex + 10 );
            }
        });

    // custom modal transition with velocity
    $('.modal').on('show.bs.modal', function(e){
        var $modal = $(e.target),
            transition = $modal.data('transition');

        if (transition) {
            $modal.velocity('transition.' + transition, 500);
        }
    }).on('hidden.bs.modal', function(e){
        var $modal = $(e.target),
            transition = $modal.data('transition');

        if (transition) {
            var n = transition.indexOf('In'),
                reverse = transition.substring(0, n) + 'Out';

            $modal.show().velocity('transition.' + reverse, 500);
        }
    });
    // END BOOTSTRAP MODAL



    // BOOTSTRAP DROPDOWN (ext animate)
    // create transition when open dropdown
    $( document ).on( 'show.bs.dropdown', '.dropdown', function () {
        var _this = $(this),
            dropdownMenu = _this.children('.dropdown-menu'),
            menuItem = dropdownMenu.children('li');

        // run transition In
        var dropdownSquence = [
            { e: dropdownMenu, p: 'transition.expandIn', o: { duration: 250 } },
            { e: menuItem, p: 'transition.slideUpIn', o: { stagger: 35, sequenceQueue: false } }
        ];
        $.Velocity.RunSequence(dropdownSquence);
    });
    // create transition when hide dropdown
    $( document ).on( 'hide.bs.dropdown', '.dropdown', function () {
        var _this = $(this),
            dropdownMenu = _this.children('.dropdown-menu');

        // run transition Out
        dropdownMenu.velocity( 'transition.slideUpOut', { duration: 250 });
    });

    // create transition when open dropup
    $( document ).on( 'show.bs.dropdown', '.dropup', function () {
        var _this = $(this),
            dropdownMenu = _this.children('.dropdown-menu'),
            menuItem = dropdownMenu.children('li');

        // run transition In
        var dropdownSquence = [
            { e: dropdownMenu, p: 'transition.expandIn', o: { duration: 250 } },
            { e: menuItem, p: 'transition.slideUpIn', o: { stagger: 35, backwards: true, sequenceQueue: false } }
        ];
        $.Velocity.RunSequence(dropdownSquence);
    });
    // create transition when hide dropup
    $( document ).on( 'hide.bs.dropdown', '.dropup', function () {
        var _this = $(this),
            dropdownMenu = _this.children('.dropdown-menu');

        // run transition Out
        dropdownMenu.velocity( 'transition.slideDownOut', { duration: 250 });
    });


    // create transition when open dropdown-ext
    $( document ).on( 'show.bs.dropdown', '.dropdown-ext', function () {
        var _this = $(this),
            dropdownMenu = _this.children('.dropdown-menu'),
            menuItem = dropdownMenu.find('.media');

        // run transition In
        var dropdownSquence = [
            { e: dropdownMenu, p: 'transition.expandIn', o: { duration: 250 } },
            { e: menuItem, p: 'transition.slideUpIn', o: { stagger: 35, sequenceQueue: false } }
        ];
        $.Velocity.RunSequence(dropdownSquence);
    });
    // create transition when hide dropdown
    $( document ).on( 'hide.bs.dropdown', '.dropdown-ext', function () {
        var _this = $(this),
            dropdownMenu = _this.children('.dropdown-menu');

        // run transition Out
        dropdownMenu.velocity( 'transition.slideUpOut', { duration: 250 });
    });
    // init slimScroll
    var ddExtScroll = $('.dropdown-ext .dd-body');
    if (ddExtScroll.length) {
        WrapkitUtils.initSlimScroll(ddExtScroll, 360);
    }
    $('.dropdown-menu-ext .dd-head, .dropdown-menu-ext .dd-actions').on( 'click', function(e){
        e.stopPropagation();
    });
    // END BOOTSTRAP DROPDOWN
})(window);
(function(){
    'use strict';

    // Form basic
    $('.autogrow').autogrow();

    var Switchery = window.Switchery,
        jsSwitch = document.querySelectorAll('.js-switch');

    // Initialize Switchery
    [].forEach.call( jsSwitch, function( el ){
        var data = el.dataset,
            options = {
                color           : ( data.color ) ? data.color : '#48CFAD',
                jackColor       : ( data.jackColor ) ? data.jackColor : '#ffffff',
                jackSecondaryColor : ( data.jackSecondaryColor ) ? data.jackSecondaryColor : '#CCD1D9',
                secondaryColor  : ( data.secondaryColor ) ? data.secondaryColor : '#E6E9ED',
                className       : ( data.className ) ? data.className : 'switchery',
                disabled        : ( data.disabled ) ? data.disabled : false,
                disabledOpacity : ( data.disabledOpacity ) ? data.disabledOpacity : 0.5,
                speed           : ( data.speed ) ? data.speed : '0.3s'
            };

        new Switchery( el, options );
    });
    // Change switchery
    // function switcheryOnChange(el) {
    //   el = (typeof(el) === 'string') ? document.querySelector(el) : el;
    //   if (typeof Event === 'function' || !document.fireEvent) {
    //     var event = document.createEvent('HTMLEvents');
    //     event.initEvent('change', true, true);
    //     el.dispatchEvent(event);
    //   } else {
    //     el.fireEvent('onchange');
    //   }
    // }
})(window);