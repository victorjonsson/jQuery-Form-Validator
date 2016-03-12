/**
 * jQuery Form Validator Module: Logic
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 *
 * - data-validation-depends-on
 * - data-validation-if-answered
 *
 * @website http://formvalidator.net/#logic
 * @license MIT
 */
(function($) {

	'use strict';

  var setupValidationDependsOn = function($form) {

      $form.find('[data-validation-depends-on]')
        .on('beforeValidation', function() {

            var $elem = $(this),
              nameOfDependingInput = $elem.valAttr('depends-on') || $elem.valAttr('if-checked');

            // Whether or not this input should be validated depends on if another input has a value
            if (nameOfDependingInput) {

              // Set the boolean telling us that the validation depends
              // on another input being checked
              var valueOfDependingInput = $.formUtils.getValue('input[name="' + nameOfDependingInput + '"]', $form),
                requiredValueOfDependingInput = $elem.valAttr('depends-on-value'),
                dependingInputHasRequiredValue = !requiredValueOfDependingInput || requiredValueOfDependingInput === valueOfDependingInput;

              if (!dependingInputHasRequiredValue) {
                $elem.valAttr('skipped', true);
              }
            }

        });

    },
    setupValidationIfAnswered = function() {

    };

  $.formUtils.$win.bind('validatorsLoaded formValidationSetup', function(evt, $form) {
    if( !$form ) {
      $form = $('form');
    }
    setupValidationDependsOn($form);
    setupValidationIfAnswered($form);
  });

})(jQuery);
