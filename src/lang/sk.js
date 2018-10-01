/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * Slovak language package
 *
 * @website http://formvalidator.net/
 * @license MIT
 */
(function($, window) {

  'use strict';

  $.formUtils.registerLoadedModule('lang/sk');

  $(window).bind('validatorsLoaded', function() {

    $.formUtils.LANG = {
      errorTitle: 'Odoslanie zlyhalo!',
      requiredField: 'Toto pole je povinné',
      requiredfields: 'Neboli vyplnené všetky povinné polia',
      badTime: 'Neplatný čas',
      badEmail: 'Neplatná e-mailová adresa',
      badTelephone: 'Neplatné telefónne číslo',
      badSecurityAnswer: 'Chyba pri odpovedi na bezpečnostnú otázku',
      badDate: 'Nesprávny dátum',
      lengthBadStart: 'Zadaná hodnota musí byť v rozmedzí ',
      lengthBadEnd: ' znaky/znakov',
      lengthTooLongStart: 'Zadaná hodnota je väčšia než ',
      lengthTooShortStart: 'Zadaná hodnota je menšia než ',
      notConfirmed: 'Zadané hodnoty neboli potvrdené',
      badDomain: 'Neplatná doména',
      badUrl: 'Neplatná URL',
      badCustomVal: 'Zadaná hodnota je chybná',
      andSpaces: ' a medzery',
      badInt: 'Neplatné číslo',
      badSecurityNumber: 'Neplatné číslo zabezpečenia',
      badUKVatAnswer: 'Neplatné číslo DIČ ',
      badStrength: 'Vaše heslo nieje dostatočne silné',
      badNumberOfSelectedOptionsStart: 'Musíte vybrať nejmenej ',
      badNumberOfSelectedOptionsEnd: ' odpoveď',
      badAlphaNumeric: 'Zadaná hodnota môže obsahovať iba alfanumerické znaky ',
      badAlphaNumericExtra: ' a ',
      wrongFileSize: 'Súbor je príliš veľký (max %s)',
      wrongFileType: 'Iba súbory typu %s',
      groupCheckedRangeStart: 'Prosím, vyberte ',
      groupCheckedTooFewStart: 'Vyberte prosím nejmenej ',
      groupCheckedTooManyStart: 'Vyberte prosím maximálne ',
      groupCheckedEnd: ' zložka(y)',
      badCreditCard: 'Číslo kreditnej karty je neplatné',
      badCVV: 'Číslo CVV je chybné',
      wrongFileDim: 'Nesprávne rozmery obrázku,',
      imageTooTall: 'obrázok nemôže byť vyšší ako',
      imageTooWide: 'obrázok nemôže byť širší ako',
      imageTooSmall: 'obrázok je príliš malý',
      min: 'min',
      max: 'max',
      imageRatioNotAccepted: 'Pomer obrázku je nesprávny',
      badBrazilTelephoneAnswer: 'Neplatné telefónne číslo',
      badBrazilCEPAnswer: 'Neplatné CEP',
      badBrazilCPFAnswer: 'Neplatné CPF'
    };

  });

})(jQuery, window);
