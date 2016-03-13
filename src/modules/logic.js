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

  var setupValidationDependsOn = function($form, conf) {

      var dependingOnBeforeValidation = function() {

          var $elem = $(this),
            nameOfDependingInput = $elem.valAttr('depends-on') || $elem.valAttr('if-checked');

          // Whether or not this input should be validated depends on if another input has a value
          if (nameOfDependingInput) {

            // Set the boolean telling us that the validation depends
            // on another input being checked
            var valueOfDependingInput = $.formUtils.getValue('[name="' + nameOfDependingInput + '"]', $form),
              requiredValueOfDependingInput = $elem.valAttr('depends-on-value'),
              dependingInputIsMissingValueOrHasIncorrectValue = !valueOfDependingInput || (
                  requiredValueOfDependingInput &&
                  requiredValueOfDependingInput !== valueOfDependingInput
                );

            if (dependingInputIsMissingValueOrHasIncorrectValue) {
              $elem.valAttr('skipped', '1');
            }

          }
        },
        dependingOnValueChanged = function() {
          var $input = $(this),
            valueOfDependingInput = $.formUtils.getValue($input),
            requiredValueOfDependingInput = $input.valAttr('depending-value'),
            dependingInputIsMissingValueOrHasIncorrectValue = !valueOfDependingInput || (
                requiredValueOfDependingInput &&
                requiredValueOfDependingInput !== valueOfDependingInput
              );

            if (dependingInputIsMissingValueOrHasIncorrectValue) {
              console.log(this.$dependingInput);
              $.formUtils.dialogs.removeInputStylingAndMessage(this.$dependingInput, conf);
            } else if ($.formUtils.getValue(this.$dependingInput)) {
              this.$dependingInput.validate();
            }
        };

      $form.find('[data-validation-depends-on]')
        .off('beforeValidation', dependingOnBeforeValidation)
        .on('beforeValidation', dependingOnBeforeValidation)
        .each(function() {
          // Remove validation when on depending input
          var $dependingInput = $(this);
          $form.find('[name="'+$dependingInput.valAttr('depends-on')+'"]').each(function() {
            this.$dependingInput = $dependingInput;
            $(this)
              .off('change', dependingOnValueChanged)
              .on('change', dependingOnValueChanged)
              .valAttr('depending-value', $dependingInput.valAttr('depends-on-value'));
          })

        });

    },
    setupValidationTogetherWith = function($form) {
      $form.find('[data-validation-optional-if-answered]')
        .on('beforeValidation', function() {
          var $input = $(this),
            dependingInputs = $input.valAttr('optional-if-optional-if-answered'),
            dependingInputsHasValue = false,
            thisInputHasAnswer = $.formUtils.getValue($input) ? true:false;

          if (!thisInputHasAnswer) {
            $.each($.split('dependingInputs'), function(inputName) {
              var $dependingInput = $form.find('[name="'+inputName+'"]');
              dependingInputsHasValue = $.formUtils.getValue($dependingInput) ? true:false;
              if (dependingInputsHasValue) {
                return false;
              }
            });

            if (dependingInputsHasValue) {
              $input.valAttr('skipped', 1);
            }
          }

        });
    };

  $.formUtils.$win.bind('validatorsLoaded formValidationSetup', function(evt, $form, conf) {
    if( !$form ) {
      $form = $('form');
    }
    setupValidationDependsOn($form, conf);
    setupValidationTogetherWith($form);
  });

})(jQuery);
