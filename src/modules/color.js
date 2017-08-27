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

  /*
    HELPER FUNCTIONS
   */
  var filterFloat = function(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
        .test(value)) {
      return Number(value);
    }

    return NaN;
  };

  var isBetween0and1 = function(value) {
    return value > 0 && value < 1;
  };

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

  /**
   * Check RGB format
   */
  $.formUtils.addValidator({
    name: 'rgb',
    validatorFunction: function(val, $el) {
      if ($el.valAttr('allow-transparent') === 'true' && val === 'transparent') {
        return true;
      }

      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/i;

      if (removedSpace.match(regex)) {
        var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
        var valueSliced = removeBrackets.split(',');
        var isValid = true;

        valueSliced.forEach(function(i) {
          var parsedInt = parseInt(i);
          if ((Number.isInteger(parsedInt) && 0 <= parsedInt && parsedInt <= 255) === false) {
            isValid = false;
          }
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badRgb'
  });

  /**
   * Check RGBA format
   */
  $.formUtils.addValidator({
    name: 'rgba',
    validatorFunction: function(val, $el) {
      if ($el.valAttr('allow-transparent') === 'true' && val === 'transparent') {
        return true;
      }

      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0,1]{1}.?[0-9]*\)/i;

      if (removedSpace.match(regex)) {
        var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
        var valueSliced = removeBrackets.split(',');
        var isValid = true;

        valueSliced.forEach(function(i) {
          var value = filterFloat(i);
          if (Number.isInteger(value)) {
            var isInRange = value >= 0 && value <= 255;
            if (!isInRange) {
              isValid = false;
            }
          } else {
            if (!isBetween0and1(value)) {
              isValid = false;
            }
          }
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badRgba'
  });

  /**
   * Check HSL format
   */
  $.formUtils.addValidator({
    name: 'hsl',
    validatorFunction: function(val, $el) {
      if ($el.valAttr('allow-transparent') === 'true' && val === 'transparent') {
        return true;
      }

      var isInRange;
      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%\)/i;

      if (removedSpace.match(regex)) {
        var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
        var valueSliced = removeBrackets.split(',');
        var isValid = true;

        valueSliced.forEach(function(i, index) {
          var parsedInt = parseInt(i);

          if (Number.isInteger(parsedInt)) {
            if (index === 0) {
              isInRange = 0 <= parsedInt && parsedInt <= 360;
              if (!isInRange) {
                isValid = false;
              }
            } else {
              isInRange = 0 <= parsedInt && parsedInt <= 100;
              if (!isInRange) {
                isValid = false;
              }
            }
          } else {
            isValid = false;
          }
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badHsl'
  });

  /**
   * Check HSLA format
   */
  $.formUtils.addValidator({
    name: 'hsla',
    validatorFunction: function(val, $el) {
      if ($el.valAttr('allow-transparent') === 'true' && val === 'transparent') {
        return true;
      }

      var isInRange;
      var removedSpace = val.replace(/ /g, '');
      var regex = /\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%,[0,1]{1}.?[0-9]*\)/i;

      if (removedSpace.match(regex)) {
        var removeBrackets = removedSpace.replace(/\(/g, '').replace(/\)/g, '');
        var valueSliced = removeBrackets.split(',');
        var isValid = true;

        valueSliced.forEach(function(i, index) {
          var value = filterFloat(i);

          if (Number.isInteger(value)) {

            if (index === 0) {
              isInRange = 0 <= value && value <= 360;
              if (!isInRange) {
                isValid = false;
              }
            } else {

              isInRange = 0 <= value && value <= 100;
              if (!isInRange) {
                isValid = false;
              }
            }
          } else {
            if (isNaN(value)) {
              // percent value
              value = parseInt(i);
              isInRange = 0 <= value && value <= 100;
              if (!isInRange) {
                isValid = false;
              }
            } else {
              isInRange = 0 <= value && value <= 1;
              if (!isInRange) {
                isValid = false;
              }
            }
          }
        });
        return isValid;
      }

      return false;
    },
    errorMessage: '',
    errorMessageKey: 'badHsla'
  });

})(jQuery);
