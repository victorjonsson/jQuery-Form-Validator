/**
 * jQuery Form Validator Module: JSconf
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 *
 * This module makes it possible to configure form validation using javascript
 *
 * @website http://formvalidator.net/#location-validators
 * @license MIT
 * @version 2.2.81
 */

(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  "use strict";

  $.setupValidation = function(conf) {
    var $forms = $(conf.form || 'form');
    $.each(conf.validate || conf.validation || {}, function(elemRef, attr) {
        var $elem;
        if( elemRef[0] == '#' ) {
          $elem = $(elemRef);
        } else if( elemRef[0] == '.' ) {
          $elem = $forms.find(elemRef);
        } else {
          $elem = $forms.find('*[name="' +elemRef+ '"]');
        }

        $elem.attr('data-validation', attr.validation);

        $.each(attr, function(name, val) {
          if( name != 'validation' && val !== false) {
            if( val === true )
              val = 'true';
            $elem.valAttr(name, val);
          }
        });
    });

    $.validate(conf);
  };

}));
