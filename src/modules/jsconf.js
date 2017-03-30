/**
 * jQuery Form Validator Module: JSconf
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 *
 * This module makes it possible to configure form validation using javascript
 *
 * @website http://formvalidator.net/#location-validators
 * @license MIT
 */
(function($) {

  'use strict';

  $.setupValidation = function(conf) {
    var $forms = $(conf.form || 'form');
    $.each(conf.validate || conf.validation || {}, function(elemRef, attr) {
        var $elem;
        if ( elemRef[0] === '#' ) {
          $elem = $(elemRef);
        }
        else if ( elemRef[0] === '.' ) {
          $elem = $forms.find(elemRef);
        }
        else {
          $elem = $forms.find('*[name="' +elemRef+ '"]');
        }

        $elem.attr('data-validation', attr.validation);

        $.each(attr, function(name, val) {
          if( name !== 'validation' && val !== false) {
            if( val === true ) {
              val = 'true';
            }
            if( name[0] === '_' ) {
                name = name.substring(1);
                if( val === false ) {
                    $elem.removeAttr(name);
                } else {
                    $elem.attr(name, val);
                }
            } else {
                $elem.valAttr(name, val);
            }
          }
        });
    });

    $.validate(conf);

  };

})(jQuery);
