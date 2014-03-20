/**
 * jQuery Form Validator Module: html5
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 *
 * The following module will make this jQuery plugin serve as a
 * html5 fallback. It makes older browsers support the following
 *  - validation when type="email"
 *  - validation when type="url"
 *  - validation when type="number" and max="" min=""
 *  - validation when pattern="REGEXP"
 *  - placeholders
 *
 * @website http://formvalidator.net/
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @version 2.1.48
 */
(function($, window) {

    "use strict";

    var SUPPORTS_PLACEHOLDER = 'placeholder' in document.createElement('input');


    $(window).bind('formValidationSetup', function(evt, $form) {
        var $formInputs = $form.find('input,textarea,select');

        $formInputs.each(function() {
            var validation = [],
                $input = $(this),
                attrs = {};

            switch ( $input.attr('type').toLowerCase() ) {
                case 'url':
                    validation.push('url');
                    break;
                case 'email':
                    validation.push('email');
                    break;
                case 'number':
                    validation.push('number');
                    var max = $input.attr('max'),
                        min = $input.attr('min');
                    if( min || max ) {
                        if( !min )
                            min = 0;
                        if( !max )
                            max = 9007199254740992; // js max int

                        attrs['data-validation-allowing'] = 'range['+min+';'+max+']';
                        if( min.indexOf('-') === 0 || max.indexOf('-') === 0 ) {
                            attrs['data-validation-allowing'] += ',negative';
                        }
                        if( min.indexOf('.') > -1 || max.indexOf('.') > -1 ) {
                            attrs['data-validation-allowing'] += ',float';
                        }
                    }
                    break;
            }

            if( validation.length == 0 && $input.attr('required') ) {
                validation.push('required');
            }

            if( $input.attr('pattern') ) {
                validation.push('custom');
                attrs['data-validation-regexp'] = $input.attr('pattern');
            }

            if( validation.length ) {
                $input.attr('data-validation', validation.join(' '));
                $.each(attrs, function(attrName, attrVal) {
                    $input.attr(attrName, attrVal);
                });
            }
        });


        if( !SUPPORTS_PLACEHOLDER ) {
            $formInputs.filter('input[placeholder]').each(function() {
                this.defaultValue = this.getAttribute('placeholder');
                $(this)
                    .bind('focus', function() {
                        if(this.value == this.defaultValue) {
                            this.value = '';
                            $(this).removeClass('showing-placeholder');
                        }
                    })
                    .bind('blur', function() {
                        if($.trim(this.value) == '') {
                            this.value = this.defaultValue;
                            $(this).addClass('showing-placeholder');
                        }
                    });
            });
        }

    });

});