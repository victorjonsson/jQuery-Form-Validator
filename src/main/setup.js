/**
 * Setup function for the plugin
 */
(function ($) {

  'use strict';


  /**
   * A bit smarter split function
   * delimiter can be space, comma, dash or pipe
   * @param {String} val
   * @param {Function|String} [callback]
   * @param {Boolean} [allowSpaceAsDelimiter]
   * @returns {Array|void}
   */
  $.split = function (val, callback, allowSpaceAsDelimiter) {
    // default to true
    allowSpaceAsDelimiter = allowSpaceAsDelimiter === undefined || allowSpaceAsDelimiter === true;
    var pattern = '[,|'+(allowSpaceAsDelimiter ? '\\s':'')+'-]\\s*',
      regex = new RegExp(pattern, 'g');
    if (typeof callback !== 'function') {
      // return array
      if (!val) {
        return [];
      }
      var values = [];
      $.each(val.split(callback ? callback : regex),
        function (i, str) {
          str = $.trim(str);
          if (str.length) {
            values.push(str);
          }
        }
      );
      return values;
    } else if (val) {
      // exec callback func on each
      $.each(val.split(regex),
        function (i, str) {
          str = $.trim(str);
          if (str.length) {
            return callback(str, i);
          }
        }
      );
    }
  };

  /**
   * Short hand function that makes the validation setup require less code
   * @param conf
   */
  $.validate = function (conf) {

    var defaultConf = $.extend($.formUtils.defaultConfig(), {
      form: 'form',
      validateOnEvent: false,
      validateOnBlur: true,
      validateCheckboxRadioOnClick: true,
      showHelpOnFocus: true,
      addSuggestions: true,
      modules: '',
      onModulesLoaded: null,
      language: false,
      onSuccess: false,
      onError: false,
      onElementValidate: false
    });

    conf = $.extend(defaultConf, conf || {});

    $(window).trigger('formValidationPluginInit', [conf]);

    if( conf.lang && conf.lang !== 'en' ) {
      var langModule = 'lang/'+conf.lang+'.js';
      conf.modules += conf.modules.length ? ','+langModule : langModule;
    }

    // Add validation to forms
    $(conf.form).each(function (i, form) {

      // Make a reference to the config for this form
      form.validationConfig = conf;

      // Trigger jQuery event that we're about to setup validation
      var $form = $(form);
      $form.trigger('formValidationSetup', [$form, conf]);

      // Remove classes and event handlers that might have been
      // added by a previous call to $.validate
      $form.find('.has-help-txt')
          .unbind('focus.validation')
          .unbind('blur.validation');

      $form
        .removeClass('has-validation-callback')
        .unbind('submit.validation')
        .unbind('reset.validation')
        .find('input[data-validation],textarea[data-validation]')
          .unbind('blur.validation');

      // Validate when submitted
      $form.bind('submit.validation', function (evt) {

        var $form = $(this),
          stop = function() {
            evt.stopImmediatePropagation();
            return false;
          };

        if ($.formUtils.haltValidation) {
          // pressing several times on submit button while validation is halted
          return stop();
        }

        if ($.formUtils.isLoadingModules) {
          setTimeout(function () {
            $form.trigger('submit.validation');
          }, 200);
          return stop();
        }

        var valid = $form.isValid(conf.language, conf);
        if ($.formUtils.haltValidation) {
          // Validation got halted by one of the validators
          return stop();
        } else {
          if (valid && typeof conf.onSuccess === 'function') {
            var callbackResponse = conf.onSuccess($form);
            if (callbackResponse === false) {
              return stop();
            }
          } else if (!valid && typeof conf.onError === 'function') {
            conf.onError($form);
            return stop();
          } else {
            return valid ? true : stop();
          }
        }
      })
      .bind('reset.validation', function () {
        $.formUtils.dialogs.removeAllMessagesAndStyling($form, conf);
      })
      .addClass('has-validation-callback');

      if (conf.showHelpOnFocus) {
        $form.showHelpOnFocus();
      }
      if (conf.addSuggestions) {
        $form.addSuggestions();
      }
      if (conf.validateOnBlur) {
        $form.validateOnBlur(conf.language, conf);
        $form.bind('html5ValidationAttrsFound', function () {
          $form.validateOnBlur(conf.language, conf);
        });
      }
      if (conf.validateOnEvent) {
        $form.validateOnEvent(conf.language, conf);
      }
    });

    if (conf.modules !== '') {
      $.formUtils.loadModules(conf.modules, false, function() {
        if (typeof conf.onModulesLoaded === 'function') {
          conf.onModulesLoaded();
        }
        var $form = typeof conf.form === 'string' ? $(conf.form) : conf.form;
        $.formUtils.$win.trigger('validatorsLoaded', [$form, conf]);
      });
    }
  };

})(jQuery);
