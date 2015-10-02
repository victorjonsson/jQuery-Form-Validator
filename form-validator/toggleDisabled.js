/**
 *  JQUERY-FORM-VALIDATOR
 *
 *  @website by 
 *  @license MIT
 *  @version 2.2.8
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b="undefined"!=typeof b?b:global,c=function(a,b){"disabled"==b?a.find('*[type="submit"]').addClass("disabled").attr("disabled","disabled"):a.find('*[type="submit"]').removeClass("disabled").removeAttr("disabled")},d=!1;a(b).bind("validatorsLoaded formValidationSetup",function(b,e,f){var g=f.disabledFormFilter?e.filter(f.disabledFormFilter):e,h=void 0===f.showErrorDialogs||f.showErrorDialogs;g.addClass(h?"disabled-with-errors":"disabled-without-errors").find("*[data-validation]").attr("data-validation-event","keyup").on("validation",function(b,e){if(!d){d=!0;var g=a(this).closest("form");e&&g.isValid(f,f.language,!1)?c(g,"enabled"):c(g,"disabled"),d=!1}}),c(g,"disabled"),g.validateOnEvent(f.language,f)}).on("validationErrorDisplay",function(a,b,c){b.closest("form").hasClass("disabled-without-errors")&&c.hide()})});