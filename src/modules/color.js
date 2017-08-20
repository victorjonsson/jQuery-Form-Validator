/**
 * jQuery Form Validator Module: Color
 * ------------------------------------------
 * Created by dszymczuk <https://github.com/dszymczuk>
 *
 *
 * This form validation module adds validators for some color formats like: hex, rgb, rgba, hsl, hsla.
 * Also it allow to use transparent as color
 * This module adds the following validators:
 *  - color
 *
 * @license MIT
 */
(function($) {

  $.formUtils.registerLoadedModule('color');

  /**
   * Check HEX format
   */
  $.formUtils.addValidator({
    name: 'hex',
    validatorFunction: function(val, $el) {
      if ($el.valAttr('allow-transparent') === 'true' && val === 'transparent') {
        return true;
      }

      var startWithHex = val[0] === '#';
      if (!startWithHex) {
        return false;
      }

      var isCorrectLength = val.length === 4 || val.length === 7;

      if (isCorrectLength) {
        var regex = /[0-9a-f]/i;
        var valueSliced = val.slice(1).split('');
        var isValid = true;
        valueSliced.forEach(function(i) {
          if (i.match(regex) === null) {
            isValid = false;
          }
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badHex'
  });




})(jQuery);
