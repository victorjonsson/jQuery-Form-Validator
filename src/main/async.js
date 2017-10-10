/**
 */
(function ($, window, undefined) {

  var disableFormSubmit = function () {
      return false;
    },
    lastFormEvent = null,
    HaltManager = {
      numHalted: 0,
      haltValidation: function($form) {
        this.numHalted++;
        $.formUtils.haltValidation = true;
        $form
          .unbind('submit', disableFormSubmit)
          .bind('submit', disableFormSubmit)
          .find('*[type="submit"]')
            .addClass('disabled')
            .attr('disabled', 'disabled');
      },
      unHaltValidation: function($form) {
        this.numHalted--;
        if (this.numHalted === 0) {
          $.formUtils.haltValidation = false;
          $form
            .unbind('submit', disableFormSubmit)
            .find('*[type="submit"]')
              .removeClass('disabled')
              .removeAttr('disabled', 'disabled');
        }
      }
    };

  function AsyncValidation($form, $input) {
    this.$form = $form;
    this.$input = $input;
    this.reset();
    $input.on('change paste', this.reset.bind(this));
  }

  AsyncValidation.prototype.reset = function() {
    this.haltedFormValidation = false;
    this.hasRun = false;
    this.isRunning = false;
    this.result = undefined;
  };

  AsyncValidation.prototype.run = function(eventContext, callback) {
    if (eventContext === 'keyup') {
      return null;
    } else if (this.isRunning) {
      lastFormEvent = eventContext;
      if (!this.haltedFormValidation) {
        HaltManager.haltValidation();
        this.haltedFormValidation = true;
      }
      return null; // Waiting for result
    } else if(this.hasRun) {
      //this.$input.one('keyup change paste', this.reset.bind(this));
      return this.result;
    } else {
      lastFormEvent = eventContext;
      HaltManager.haltValidation(this.$form);
      this.haltedFormValidation = true;
      this.isRunning = true;
      this.$input
        .attr('disabled', 'disabled')
        .addClass('async-validation');
      this.$form.addClass('async-validation');

      callback(function(result) {
        this.done(result);
      }.bind(this));

      return null;
    }
  };

  AsyncValidation.prototype.done = function(result) {
    this.result = result;
    this.hasRun = true;
    this.isRunning = false;
    this.$input
      .removeAttr('disabled')
      .removeClass('async-validation');
    this.$form.removeClass('async-validation');
    if (this.haltedFormValidation) {
      HaltManager.unHaltValidation(this.$form);
      if (lastFormEvent === 'submit') {
        this.$form.trigger('submit');
      } else {
        this.$input.trigger('validation.revalidate');
      }
    }
  };

  AsyncValidation.loadInstance = function(validatorName, $input, $form) {
    // Return async validator attached to this input element
    // or create a new async validator and attach it to the input
    var asyncValidation,
      input = $input.get(0);

    if (!input.asyncValidators) {
      input.asyncValidators = {};
    }

    if (input.asyncValidators[validatorName]) {
      asyncValidation = input.asyncValidators[validatorName];
    } else {
      asyncValidation = new AsyncValidation($form, $input);
      input.asyncValidators[validatorName] = asyncValidation;
    }

    return asyncValidation;
  };

  $.formUtils = $.extend($.formUtils || {}, {

    /**
     * @deprecated
     * @param validatorName
     * @param $input
     * @param $form
     */
    asyncValidation: function(validatorName, $input, $form) {
      // @todo: Remove when moving up to version 3.0
      this.warn('Use of deprecated function $.formUtils.asyncValidation, use $.formUtils.addAsyncValidator() instead');
      return AsyncValidation.loadInstance(validatorName, $input, $form);
    },

    /**
     * @param {Object} asyncValidator
     */
    addAsyncValidator: function (asyncValidator) {
      var validator = $.extend({}, asyncValidator),
        originalValidatorFunc = validator.validatorFunction;
      validator.async = true;
      validator.validatorFunction = function (value, $el, config, language, $form, eventContext) {
        var asyncValidation = AsyncValidation.loadInstance(this.name, $el, $form);
        return asyncValidation.run(eventContext, function(done) {
          originalValidatorFunc.apply(validator, [
            done, value, $el, config, language, $form, eventContext
          ]);
        });
      };
      this.addValidator(validator);
    }
  });

  // Tag elements having async validators
  $(window).bind('validatorsLoaded formValidationSetup', function (evt, $form) {
    if (!$form) {
      $form = $('form');
    }
    $form.find('[data-validation]').each(function () {
      var $input = $(this);
      $input.valAttr('async', false);
      $.each($.split($input.attr('data-validation')), function (i, validatorName) {
        var validator = $.formUtils.validators['validate_'+validatorName];
        if (validator && validator.async) {
          $input.valAttr('async', 'yes');
        }
      });
    });
  });

})(jQuery, window);
