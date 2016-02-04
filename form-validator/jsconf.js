/**
 *  JQUERY-FORM-VALIDATOR
 *
 *  @version 2.2.144
 *  @website http://formvalidator.net/
 *  @author Victor Jonsson, http://victorjonsson.se
 *  @license MIT
 */
!function(a){"use strict";a.setupValidation=function(b){var c=a(b.form||"form");a.each(b.validate||b.validation||{},function(b,d){var e;e="#"===b[0]?a(b):c.find("."===b[0]?b:'*[name="'+b+'"]'),e.attr("data-validation",d.validation),a.each(d,function(a,b){"validation"!==a&&b!==!1&&(b===!0&&(b="true"),"_"===a[0]?(a=a.substring(1),b===!1?e.removeAttr(a):e.attr(a,b)):e.valAttr(a,b))})}),a.validate(b)}}(jQuery);