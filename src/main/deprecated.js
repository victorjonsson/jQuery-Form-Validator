/**
 * Deprecated functions and attributes
 * @todo: Remove in release of 3.0
 */
(function ($, undefined) {

  'use strict';

  /**
   * @deprecated
   * @param language
   * @param conf
   */
  $.fn.validateForm = function (language, conf) {
    $.formUtils.warn('Use of deprecated function $.validateForm, use $.isValid instead');
    return this.isValid(language, conf, true);
  };

  $(window)
    .on('formValidationPluginInit', function(evt, config) {
      convertDeprecatedLangCodeToISO6391(config);
      addSupportForCustomErrorMessageCallback(config);
      addSupportForElementReferenceInPositionParam(config);
    })
    .on('validatorsLoaded formValidationSetup', function(evt, $form) {
      if( !$form ) {
        $form = $('form');
      }
      addSupportForValidationDependingOnCheckedInput($form);
    });


  function addSupportForCustomErrorMessageCallback(config) {
    if (config &&
        config.errorMessagePosition === 'custom' &&
        typeof config.errorMessageCustom === 'function') {

      $.formUtils.warn('Use of deprecated function errorMessageCustom, use config.submitErrorMessageCallback instead');

      config.submitErrorMessageCallback = function($form, errorMessages) {
        config.errorMessageCustom(
            $form,
            config.language.errorTitle,
            errorMessages,
            config
        );
      };
    }
  }

  function addSupportForElementReferenceInPositionParam(config) {
    if (config.errorMessagePosition && typeof config.errorMessagePosition === 'object') {
      $.formUtils.warn('Deprecated use of config parameter errorMessagePosition, use config.submitErrorMessageCallback instead');
      var $errorMessageContainer = config.errorMessagePosition;
      config.errorMessagePosition = 'top';
      config.submitErrorMessageCallback = function() {
        return $errorMessageContainer;
      };
    }
  }

  function addSupportForValidationDependingOnCheckedInput($form) {
    var $inputsDependingOnCheckedInputs = $form.find('[data-validation-if-checked]');
    if ($inputsDependingOnCheckedInputs.length) {
      $.formUtils.warn(
        'Detected use of attribute "data-validation-if-checked" which is '+
        'deprecated. Use "data-validation-depends-on" provided by module "logic"'
      );
    }

    $inputsDependingOnCheckedInputs
      .on('beforeValidation', function() {

        var $elem = $(this),
          nameOfDependingInput = $elem.valAttr('if-checked');

        // Set the boolean telling us that the validation depends
        // on another input being checked
        var $dependingInput = $('input[name="' + nameOfDependingInput + '"]', $form),
          dependingInputIsChecked = $dependingInput.is(':checked'),
          valueOfDependingInput = ($.formUtils.getValue($dependingInput) || '').toString(),
          requiredValueOfDependingInput = $elem.valAttr('if-checked-value');

        if (!dependingInputIsChecked || !(
              !requiredValueOfDependingInput ||
              requiredValueOfDependingInput === valueOfDependingInput
          )) {
          $elem.valAttr('skipped', true);
        }

      });
    }

    function convertDeprecatedLangCodeToISO6391(config) {
      var deprecatedLangCodes = {
        se: 'sv',
        cz: 'cs',
        dk: 'da'
      };

      if (config.lang in deprecatedLangCodes) {
        var newLangCode = deprecatedLangCodes[config.lang];
        $.formUtils.warn(
          'Deprecated use of lang code "'+config.lang+'" use "'+newLangCode+'" instead'
        );
        config.lang = newLangCode;
      }
    }

})(jQuery);
