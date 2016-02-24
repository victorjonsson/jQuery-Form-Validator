/**
 * Utility methods used for displaying error messages (attached to $.formUtils)
 */
(function ($) {

  'use strict';

  var errorDialogs = {

    getParentContainer: function ($elem) {
      if ($elem.valAttr('error-msg-container')) {
        return $($elem.valAttr('error-msg-container'));
      } else {
        var $parent = $elem.parent();
        if (!$parent.hasClass('form-group') && !$parent.closest('form').hasClass('form-horizontal')) {
          var $formGroup = $parent.closest('.form-group');
          if ($formGroup.length) {
            return $formGroup.eq(0);
          }
        }
        return $parent;
      }
    },
    applyErrorStyling: function ($elem, conf) {
      $elem
        .addClass(conf.errorElementClass)
        .removeClass('valid');

      this.getParentContainer($elem)
        .addClass(conf.inputParentClassOnError)
        .removeClass(conf.inputParentClassOnSuccess);

      if (conf.borderColorOnError !== '') {
        $elem.css('border-color', conf.borderColorOnError);
      }
    },
    removeErrorStyling: function ($elem, conf) {
      $elem.each(function () {
        var $this = $(this);

        errorDialogs.setInlineErrorMessage($this, '', conf, conf.errorMessagePosition);

        $this
          .removeClass('valid')
          .removeClass(conf.errorElementClass)
          .css('border-color', '');

        errorDialogs.getParentContainer($this)
          .removeClass(conf.inputParentClassOnError)
          .removeClass(conf.inputParentClassOnSuccess)
          .find('.' + conf.errorMessageClass) // remove inline span holding error message
          .remove();
      });
    },
    setInlineErrorMessage: function ($input, errorMsg, conf, $messageContainer) {
      var custom = document.getElementById($input.attr('name') + '_err_msg'),
        setErrorMessage = function ($elem) {
          $.formUtils.$win.trigger('validationErrorDisplay', [$input, $elem]);
          $elem.html(errorMsg);
        },
        $message;

      if (custom) {
        $.formUtils.warn('Using deprecated element reference ' + custom.id);
        $messageContainer = $(custom);
      } else if (typeof $messageContainer === 'function') {
        $messageContainer = $messageContainer($input, errorMsg, conf);
      }

      if (typeof $messageContainer === 'object') {
        var $found = false;
        $messageContainer.find('.' + conf.errorMessageClass).each(function () {
          if (this.inputReferer === $input[0]) {
            $found = $(this);
            return false;
          }
        });
        if ($found) {
          if (!errorMsg) {
            $found.remove();
          } else {
            setErrorMessage($found);
          }
        } else if(errorMsg !== '') {
          $message = $('<div class="' + conf.errorMessageClass + ' alert"></div>');
          setErrorMessage($message);
          $message[0].inputReferer = $input[0];
          $messageContainer.prepend($message);
        }
      }
      else {
        var $parent = this.getParentContainer($input);
        $message = $parent.find('.' + conf.errorMessageClass + '.help-block');

        if ($message.length === 0) {
          $message = $('<span></span>').addClass('help-block').addClass(conf.errorMessageClass);
          $message.appendTo($parent);
        }

        setErrorMessage($message);
      }
    },
    setTemplateMessage: function ($form, title, errorMessages, conf) {
      var messages = conf.errorMessageTemplate.messages.replace(/\{errorTitle\}/g, title),
        fields = [],
        container;

      $.each(errorMessages, function (i, msg) {
        fields.push(conf.errorMessageTemplate.field.replace(/\{msg\}/g, msg));
      });

      messages = messages.replace(/\{fields\}/g, fields.join(''));
      container = conf.errorMessageTemplate.container.replace(/\{errorMessageClass\}/g, conf.errorMessageClass);
      container = container.replace(/\{messages\}/g, messages);
      $form.children().eq(0).before(container);
    }
  };

  $.formUtils = $.extend($.formUtils || {}, {
    errorDialogs: errorDialogs
  });

})(jQuery);
