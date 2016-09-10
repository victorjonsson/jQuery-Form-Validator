/**
 */
(function ($, undefined) {

  var disableFormSubmit = function () {
      return false;
    },
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
      if (!this.haltedFormValidation && eventContext === 'submit') {
        HaltManager.haltValidation();
        this.haltedFormValidation = true;
      }
      return null; // Waiting for result
    } else if(this.hasRun) {
      //this.$input.one('keyup change paste', this.reset.bind(this));
      return this.result;
    } else {
      if (eventContext === 'submit') {
        HaltManager.haltValidation(this.$form);
        this.haltedFormValidation = true;
      }
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
      this.$form.trigger('submit');
    } else {
      this.$input.trigger('validation.revalidate');
    }
  };

  $.formUtils = $.extend($.formUtils || {}, {
    asyncValidation: function(validatorName, $input, $form) {
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
    }
  });

})(jQuery);
