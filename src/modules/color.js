/**
 * jQuery Form Validator Module: Color
 * ------------------------------------------
 * Created by dszymczuk <https://github.com/dszymczuk>
 *
 * This form
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
    validatorFunction: function(val, $el){
      if($el.valAttr('allow-transparent') === 'true' && val === 'transparent'){
        return true;
      }

      var startWithHex = val[0] === "#";
      var isCorrectLength = val.length === 4 || val.length === 7;

      if(isCorrectLength){
        var regex = /[0-9a-f]/i;
        var valueSliced = val.slice(1).split('');
        var isValid = true;
        valueSliced.forEach(function(i){
          if(i.match(regex) === null)
            isValid = false;
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badHex'
  });


  /**
   * Check RGB format
   */
  $.formUtils.addValidator({
    name: 'rgb',
    validatorFunction: function(val, $el){
      if($el.valAttr('allow-transparent') === 'true' && val === 'transparent'){
        return true;
      };

      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/i;

      if(removedSpace.match(regex)){
        var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
        var valueSliced = removeBrackets.split(',');
        var isValid = true;

        valueSliced.forEach(function(i){
          var parsedInt = parseInt(i);
          if((Number.isInteger(parsedInt) && 0 <= parsedInt && parsedInt <= 255) === false)
            isValid = false;
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badRgb'
  });

})(jQuery);
