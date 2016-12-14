/**
 * File declaring all methods if this plugin which is applied to $.fn.
 */
(function($, window, undefined) {

  'use strict';

  var _helpers = 0;


  /**
   * Assigns validateInputOnBlur function to elements blur event
   *
   * @param {Object} language Optional, will override $.formUtils.LANG
   * @param {Object} conf Optional, will override the default settings
   * @return {jQuery}
   */
  $.fn.validateOnBlur = function (language, conf) {
    var $form = this,
        $elems = this.find('*[data-validation]');

    $elems.each(function(){
      var $this = $(this);
      if ($this.is('[type=radio]')){
        var $additionals = $form.find('[type=radio][name="' + $this.attr('name') + '"]');
        $additionals.bind('blur.validation', function(){
          $this.validateInputOnBlur(language, conf, true, 'blur');
        });
        if (conf.validateCheckboxRadioOnClick) {
          $additionals.bind('click.validation', function () {
            $this.validateInputOnBlur(language, conf, true, 'click');
          });
        }
      }
    });

    $elems.bind('blur.validation', function () {
      $(this).validateInputOnBlur(language, conf, true, 'blur');
    });

    if (conf.validateCheckboxRadioOnClick) {
      // bind click event to validate on click for radio & checkboxes for nice UX
      this.find('input[type=checkbox][data-validation],input[type=radio][data-validation]')
        .bind('click.validation', function () {
          $(this).validateInputOnBlur(language, conf, true, 'click');
        });
    }

    return this;
  };

  /*
   * Assigns validateInputOnBlur function to elements custom event
   * @param {Object} language Optional, will override $.formUtils.LANG
   * @param {Object} settings Optional, will override the default settings
   * * @return {jQuery}
   */
  $.fn.validateOnEvent = function (language, config) {
    var $elements = this[0].nodeName === 'FORM' ? this.find('*[data-validation-event]') : this;
    $elements
      .each(function () {
        var $el = $(this),
          etype = $el.valAttr('event');
        if (etype) {
          $el
            .unbind(etype + '.validation')
            .bind(etype + '.validation', function (evt) {
              if( (evt || {}).keyCode !== 9 ) {
                $(this).validateInputOnBlur(language, config, true, etype);
              }
            });
        }
      });
    return this;
  };

  /**
   * fade in help message when input gains focus
   * fade out when input loses focus
   * <input data-help="The info that I want to display for the user when input is focused" ... />
   *
   * @param {String} attrName - Optional, default is data-help
   * @return {jQuery}
   */
  $.fn.showHelpOnFocus = function (attrName) {
    if (!attrName) {
      attrName = 'data-validation-help';
    }

    // Add help text listeners
    this.find('textarea,input').each(function () {
      var $elem = $(this),
        className = 'jquery_form_help_' + (++_helpers),
        help = $elem.attr(attrName);

      // Reset
      $elem
        .removeClass('has-help-text')
        .unbind('focus.help')
        .unbind('blur.help');

      if (help) {
        $elem
          .addClass('has-help-txt')
          .bind('focus.help', function () {
            var $help = $elem.parent().find('.' + className);
            if ($help.length === 0) {
              $help = $('<span />')
                .addClass(className)
                .addClass('help')
                .addClass('help-block') // twitter bs
                .text(help)
                .hide();

              $elem.after($help);
            }
            $help.fadeIn();
          })
          .bind('blur.help', function () {
            $(this)
              .parent()
              .find('.' + className)
              .fadeOut('slow');
          });
      }
    });

    return this;
  };

  /**
   * @param {Function} cb
   * @param {Object} [conf]
   * @param {Object} [lang]
   */
  $.fn.validate = function(cb, conf, lang) {
    var language = $.extend({}, $.formUtils.LANG, lang || {});
    this.each(function() {
      var $elem = $(this),
        $closestForm = $elem.closest('form').get(0) || {},
        formDefaultConfig = $closestForm.validationConfig || {};

      $elem.one('validation', function(evt, isValid) {
        if ( typeof cb === 'function' ) {
          cb(isValid, this, evt);
        }
      });

      $elem.validateInputOnBlur(
        language,
        $.extend({}, formDefaultConfig, conf || {}),
        true
      );
    });
  };

  /**
   * Tells whether or not validation of this input will have to postpone the form submit ()
   * @returns {Boolean}
   */
  $.fn.willPostponeValidation = function() {
    return (this.valAttr('suggestion-nr') ||
      this.valAttr('postpone') ||
      this.hasClass('hasDatepicker')) &&
      !window.postponedValidation;
  };

  /**
   * Validate single input when it loses focus
   * shows error message in a span element
   * that is appended to the parent element
   *
   * @param {Object} [language] Optional, will override $.formUtils.LANG
   * @param {Object} [conf] Optional, will override the default settings
   * @param {Boolean} attachKeyupEvent Optional
   * @param {String} eventContext
   * @return {jQuery}
   */
  $.fn.validateInputOnBlur = function (language, conf, attachKeyupEvent, eventContext) {

    $.formUtils.eventType = eventContext;

    if ( this.willPostponeValidation() ) {
      // This validation has to be postponed
      var _self = this,
        postponeTime = this.valAttr('postpone') || 200;

      window.postponedValidation = function () {
        _self.validateInputOnBlur(language, conf, attachKeyupEvent, eventContext);
        window.postponedValidation = false;
      };

      setTimeout(function () {
        if (window.postponedValidation) {
          window.postponedValidation();
        }
      }, postponeTime);

      return this;
    }

    language = $.extend({}, $.formUtils.LANG, language || {});
    $.formUtils.dialogs.removeInputStylingAndMessage(this, conf);

    var $elem = this,
      $form = $elem.closest('form'),
      result = $.formUtils.validateInput(
        $elem,
        language,
        conf,
        $form,
        eventContext
      );

    var reValidate = function() {
      $elem.validateInputOnBlur(language, conf, false, 'blur.revalidated');
    };

    if (eventContext === 'blur') {
      $elem
        .unbind('validation.revalidate', reValidate)
        .one('validation.revalidate', reValidate);
    }

    if (attachKeyupEvent) {
      $elem.removeKeyUpValidation();
    }

    if (result.shouldChangeDisplay) {
      if (result.isValid) {
        $.formUtils.dialogs.applyInputSuccessStyling($elem, conf);
      } else {
        $.formUtils.dialogs.setInlineMessage($elem, result.errorMsg, conf);
      }
    }

    if (!result.isValid && attachKeyupEvent) {
      $elem.validateOnKeyUp(language, conf);
    }

    return this;
  };

  /**
   * Validate element on keyup-event
   */
  $.fn.validateOnKeyUp = function(language, conf) {
    this.each(function() {
      var $input = $(this);
      if (!$input.valAttr('has-keyup-event')) {
        $input
          .valAttr('has-keyup-event', 'true')
          .bind('keyup.validation', function (evt) {
            if( evt.keyCode !== 9 ) {
              $input.validateInputOnBlur(language, conf, false, 'keyup');
            }
          });
      }
    });
    return this;
  };

  /**
   * Remove validation on keyup
   */
  $.fn.removeKeyUpValidation = function() {
    this.each(function() {
      $(this)
        .valAttr('has-keyup-event', false)
        .unbind('keyup.validation');
    });
    return this;
  };

  /**
   * Short hand for fetching/adding/removing element attributes
   * prefixed with 'data-validation-'
   *
   * @param {String} name
   * @param {String|Boolean} [val]
   * @return {String|undefined|jQuery}
   * @protected
   */
  $.fn.valAttr = function (name, val) {
    if (val === undefined) {
      return this.attr('data-validation-' + name);
    } else if (val === false || val === null) {
      return this.removeAttr('data-validation-' + name);
    } else {
      name = ((name.length > 0) ? '-' + name : '');
      return this.attr('data-validation' + name, val);
    }
  };

  /**
   * Function that validates all inputs in active form
   *
   * @param {Object} [language]
   * @param {Object} [conf]
   * @param {Boolean} [displayError] Defaults to true
   */
  $.fn.isValid = function (language, conf, displayError) {

    if ($.formUtils.isLoadingModules) {
      var $self = this;
      setTimeout(function () {
        $self.isValid(language, conf, displayError);
      }, 200);
      return null;
    }

    conf = $.extend({}, $.formUtils.defaultConfig(), conf || {});
    language = $.extend({}, $.formUtils.LANG, language || {});
    displayError = displayError !== false;

    if ($.formUtils.errorDisplayPreventedWhenHalted) {
      // isValid() was called programmatically with argument displayError set
      // to false when the validation was halted by any of the validators
      delete $.formUtils.errorDisplayPreventedWhenHalted;
      displayError = false;
    }

    /**
     * Adds message to error message stack if not already in the message stack
     *
     * @param {String} mess
     * @para {jQuery} $elem
     */
    var addErrorMessage = function (mess, $elem) {
        if ($.inArray(mess, errorMessages) < 0) {
          errorMessages.push(mess);
        }
        errorInputs.push($elem);
        $elem.valAttr('current-error', mess);
        if (displayError) {
          $.formUtils.dialogs.applyInputErrorStyling($elem, conf);
        }
      },

      /** Holds inputs (of type checkox or radio) already validated, to prevent recheck of mulitple checkboxes & radios */
      checkedInputs = [],

      /** Error messages for this validation */
      errorMessages = [],

      /** Input elements which value was not valid */
      errorInputs = [],

      /** Form instance */
      $form = this,

      /**
       * Tells whether or not to validate element with this name and of this type
       *
       * @param {String} name
       * @param {String} type
       * @return {Boolean}
       */
      ignoreInput = function (name, type) {
        if (type === 'submit' || type === 'button' || type === 'reset') {
          return true;
        }
        return $.inArray(name, conf.ignore || []) > -1;
      };

    // Reset style and remove error class
    if (displayError) {
      $.formUtils.dialogs.removeAllMessagesAndStyling($form, conf);
    }

    // Validate element values
    $form.find('input,textarea,select').filter(':not([type="submit"],[type="button"])').each(function () {
      var $elem = $(this),
        elementType = $elem.attr('type'),
        isCheckboxOrRadioBtn = elementType === 'radio' || elementType === 'checkbox',
        elementName = $elem.attr('name');

      if (!ignoreInput(elementName, elementType) && (!isCheckboxOrRadioBtn || $.inArray(elementName, checkedInputs) < 0)) {

        if (isCheckboxOrRadioBtn) {
          checkedInputs.push(elementName);
        }

        var result = $.formUtils.validateInput(
          $elem,
          language,
          conf,
          $form,
          'submit'
        );

        if (!result.isValid) {
          addErrorMessage(result.errorMsg, $elem);
        } else if (result.isValid && result.shouldChangeDisplay) {
          $elem.valAttr('current-error', false);
          $.formUtils.dialogs.applyInputSuccessStyling($elem, conf);
        }
      }

    });

    // Run validation callback
    if (typeof conf.onValidate === 'function') {
      var errors = conf.onValidate($form);
      if ($.isArray(errors)) {
        $.each(errors, function (i, err) {
          addErrorMessage(err.message, err.element);
        });
      }
      else if (errors && errors.element && errors.message) {
        addErrorMessage(errors.message, errors.element);
      }
    }

    // Reset form validation flag
    $.formUtils.isValidatingEntireForm = false;

    // Validation failed
    if (errorInputs.length > 0) {
      if (displayError) {
        if (conf.errorMessagePosition === 'top') {
          $.formUtils.dialogs.setMessageInTopOfForm($form, errorMessages, conf, language);
        } else {
          $.each(errorInputs, function (i, $input) {
            $.formUtils.dialogs.setInlineMessage($input, $input.valAttr('current-error'), conf);
          });
        }
        if (conf.scrollToTopOnError) {
          $.formUtils.$win.scrollTop($form.offset().top - 20);
        }
      }
    }

    if (!displayError && $.formUtils.haltValidation) {
      $.formUtils.errorDisplayPreventedWhenHalted = true;
    }

    return errorInputs.length === 0 && !$.formUtils.haltValidation;
  };

  /**
   * Plugin for displaying input length restriction
   */
  $.fn.restrictLength = function (maxLengthElement) {
    new $.formUtils.lengthRestriction(this, maxLengthElement);
    return this;
  };

  /**
   * Add suggestion dropdown to inputs having data-suggestions with a comma
   * separated string with suggestions
   * @param {Array} [settings]
   * @returns {jQuery}
   */
  $.fn.addSuggestions = function (settings) {
    var sugs = false;
    this.find('input').each(function () {
      var $field = $(this);

      sugs = $.split($field.attr('data-suggestions'));

      if (sugs.length > 0 && !$field.hasClass('has-suggestions')) {
        $.formUtils.suggest($field, sugs, settings);
        $field.addClass('has-suggestions');
      }
    });
    return this;
  };


})(jQuery, window);
