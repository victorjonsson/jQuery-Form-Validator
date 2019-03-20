/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * Georgian language package
 *
 * @website http://formvalidator.net/
 * @license MIT
 */
(function($, window) {

  'use strict';

  $.formUtils.registerLoadedModule('lang/ka');

  $(window).bind('validatorsLoaded', function() {

    $.formUtils.LANG = {
      errorTitle: 'ფორმა ვერ გაიგზავნა!',
      requiredField: 'ველის შევსება სავალდებულოა',
      requiredFields: 'თქვენ არ შეგივსიათ ყველა სავალდებულო ველი',
      badTime: 'თქვენ მიუთითეთ არასწორი დრო',
      badEmail: 'თქვენ მიუთითეთ არასწორი ელ.ფოსტის მისამართი',
      badTelephone: 'თქვენ მიუთითეთ არასწორი ტელეფონის ნომერი',
      badSecurityAnswer: 'თქვენ გაეცით არასწორი პასუხი უსაფრთხოების კითხვას',
      badDate: 'თქვენ მიუთითეთ არასწორი თარიღი',
      badDateBefore: 'The minimum allowed date is ',
      badDateAfter: 'The maximum allowed date is ',
      lengthBadStart: 'ველის მნიშვნელობის სიგრძე უნდა იყოს ',
      lengthBadEnd: ' შუალედში',
      lengthTooLongStart: 'ველის მნიშვნელობის სიგრძე უნდა იყოს მაქსიმუმ ',
      lengthTooShortStart: 'ველის მნიშვნელობის სიგრძე უნდა იყოს მინიმუმ ',
      notConfirmed: 'ველის მნიშვნელობები ვერ დადასტურდა',
      badDomain: 'არასწორი დომენის მისამართი',
      badUrl: 'ველის მნიშვნელობა არ არის მართებული URL მისამართი',
      badCustomVal: 'ველის მნიშვნელობა არ არის მართებული',
      andSpaces: ' და გამოტოვებები ',
      badInt: 'ველის მნიშვნელობა არ არის მართებული რიცხვი',
      badStrength: 'პაროლი არ არის საკმარისად ძლიერი (კარგი)',
      badNumberOfSelectedOptionsStart: 'თქვენ უნდა აირჩიოთ სულ მცირე ',
      badNumberOfSelectedOptionsEnd: ' პასუხი',
      badAlphaNumeric: 'ველის მნიშვნელობა უნდა შეიცავდეს მხოლოდ ციფრებსა და ასოებს ',
      badAlphaNumericExtra: ' და ',
      wrongFileSize: 'ფაილი, რომლის ატვირთვასაც ცდილობთ არის ძალიან დიდი (დასაშვებია მაქსიმუმ %s)',
      wrongFileType: 'დასაშვებია მხოლოდ შემდეგი გაფართოების ფაილები: %s',
      groupCheckedRangeStart: 'გთხოვთ, აირჩიოთ ',
      groupCheckedTooFewStart: 'გთხოვთ, აირჩიოთ სულ მცირე ',
      groupCheckedTooManyStart: 'გთხოვთ, აირჩიოთ მაქსიმუმ ',
      groupCheckedEnd: ' პუნქტი',
      badCreditCard: 'საკრედიტო ბარათის ნომერი არ არის მართებული',
      badCVV: 'CVV კოდი არ არის მართებული',
      wrongFileDim: 'არამართებული სურათის ზომები,',
      imageTooTall: 'სურათი არ უნდა იყოს უფრო გრძელი ვიდრე',
      imageTooWide: 'სურათი არ უნდა იყოს უფრო ფართე ვიდრე',
      imageTooSmall: 'სურათი არის ძალიან პატარა',
      min: 'მინიმუმ',
      max: 'მაქსიმუმ',
      imageRatioNotAccepted: 'სურათის სიგრძისა და სიგანის ეს თანაფარდობა დაუშვებელია',
      badBrazilTelephoneAnswer: 'მითითებული ტელეფონის ნომერი არ არის მართებული',
      badreCaptcha: 'დაადასტურეთ, რომ არ ხართ რობოტი',
      passwordComplexityStart: 'პაროლი უნდა შეიცავდეს მინიმუმ ',
      passwordComplexitySeparator: ', ',
      passwordComplexityUppercaseInfo: ' დიდი ასო(ები)',
      passwordComplexityLowercaseInfo: ' პატარა ასო(ები)',
      passwordComplexitySpecialCharsInfo: ' სპეციალური სიმბოლო(ები)',
      passwordComplexityNumericCharsInfo: ' რიცხვითი მნიშვნელობა(ები)',
      passwordComplexityEnd: '.'
    };
  });

})(jQuery, window);
