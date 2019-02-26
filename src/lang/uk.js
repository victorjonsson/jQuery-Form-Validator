/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * Russian language package
 *
 * @website http://formvalidator.net/
 * @license MIT
 */
(function($, window) {

  'use strict';

  $.formUtils.registerLoadedModule('lang/ru');

  $(window).bind('validatorsLoaded', function() {

    $.formUtils.LANG = {

      errorTitle: 'Помилка відправки форми!',
      requiredField: 'Це поле обов\'якове',
      requiredFields: 'Ви ввели не всі обов\'якові поля',
      badTime: 'Ви задали некоректний час',
      badEmail: 'Ви задали некоректний e-mail',
      badTelephone: 'Ви задали некоректний номер телефону',
      badSecurityAnswer: 'Ви задали некоректну відповідь на секретне питання',
      badDate: 'Ви задали некоректну дату',
      lengthBadStart: 'Значення має бути в діапазоні',
      lengthBadEnd: ' символів',
      lengthTooLongStart: 'Значення довше, ніж ',
      lengthTooShortStart: 'Значення меньше, ніж ',
      notConfirmed: 'Введені значення не можуть бути підтверждені',
      badDomain: 'Некоректне значення домена',
      badUrl: 'Некоретний URL',
      badCustomVal: 'Введені значення невірні',
      andSpaces: ' і пропуски ',
      badInt: 'Значення - не число',
      badSecurityNumber: 'Введений захисний номер - не правильний',
      badUKVatAnswer: 'некоректний UK VAT номер',
      badStrength: 'Пароль не достатньо надійний',
      badNumberOfSelectedOptionsStart: 'Ви маєте вибрати як мінімум ',
      badNumberOfSelectedOptionsEnd: ' відповідей',
      badAlphaNumeric: 'Значення має містити тільки числа та букви ',
      badAlphaNumericExtra: ' і ',
      wrongFileSize: 'Завантажений файл занадто великий (максимальний розмер %s)',
      wrongFileType: 'Приймаються файли наступних типів %s',
      groupCheckedRangeStart: 'Виберіть між ',
      groupCheckedTooFewStart: 'Виберіть як мінімум ',
      groupCheckedTooManyStart: 'Виберіть максимум з ',
      groupCheckedEnd: ' елемент(ів)',
      badCreditCard: 'Номер кредитної картки некоректний',
      badCVV: 'CVV номер некоректний',
      wrongFileDim : 'Не правильні розміри графічного файлу,',
      imageTooTall : 'зображення не може бути вужче ніж',
      imageTooWide : 'зображення не може бути ширше ніж',
      imageTooSmall : 'зображення занадто мале',
      min : 'мінімум',
      max : 'максимум',
      imageRatioNotAccepted : 'Зображення з таким співвідношенням сторін не приймаєтся',
      badBrazilTelephoneAnswer: 'Введений номер телефону неправильний',
      badBrazilCEPAnswer: 'CEP неправильний',
      badBrazilCPFAnswer: 'CPF неправильний'
    };

  });

})(jQuery, window);
