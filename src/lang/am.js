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

      errorTitle: 'Ձևի ուղարկման սխալ',
      requiredField: 'Պարտադիր դաշտ',
      requiredFields: 'Ոչ բոլոր պարտադիր դաշտերն են ներմուծված',
      badTime: 'Ներմուծված է սխալ ժամանակ',
      badEmail: 'Ներմուծված է սխալ e-mail',
      badTelephone: 'Ներմուծված է սխալ հեռախոսահամար',
      badSecurityAnswer: 'Ոչ ճշգրիտ պատասխան գաղտնի հարցին',
      badDate: 'Ներմուծված է սխալ ամսաթիվ',
      lengthBadStart: 'Նշանը պետք է լինի ընդգրկույթում',
      lengthBadEnd: ' պայմանանշաններ',
      lengthTooLongStart: 'Նշանը ավելի երկար է, քան ',
      lengthTooShortStart: 'Նշանը ավելի փոքր է, քան ',
      notConfirmed: 'Ներմուշված նշանները չեն կարող հաստատվել',
      badDomain: 'Դոմենի ոչ ճշգրիտ նշան',
      badUrl: 'Ոչ ճշգրիտ URL',
      badCustomVal: 'Ներմուծված նշանը ճշգրիտ չէ',
      andSpaces: ' և բացատ ',
      badInt: 'Նշանը - թիվ չէ',
      badSecurityNumber: 'Ներմուծված պաշտպանիչ համարը - ճշգրիտ չէ',
      badUKVatAnswer: 'Ոչ ճշգրիտ UK VAT համար',
      badStrength: 'Գաղտնաբառը բավականաչափ հուսալի չէ',
      badNumberOfSelectedOptionsStart: 'Ամենաքիչը պետք է հավաքեք ',
      badNumberOfSelectedOptionsEnd: ' պատասխաններ',
      badAlphaNumeric: 'Պետք է պարունակի միայն թվեր ու տառեր ',
      badAlphaNumericExtra: ' և ',
      wrongFileSize: 'Բեռնվող ֆայլը չափազանց մեծ է (մաքսիմալ չափը %s)',
      wrongFileType: 'Ընդունվում են հետևյալ տիպի ֆայլերը %s',
      groupCheckedRangeStart: 'Ընտրեք հետևյալներից ',
      groupCheckedTooFewStart: 'Ընտրեք ամենաքիչը ',
      groupCheckedTooManyStart: 'Ընտրրեք առավելագույնը ',
      groupCheckedEnd: ' տարր(եր)',
      badCreditCard: 'Կրեդիտային քարտի համարը սխալ է',
      badCVV: 'CVV համարը սխալ է',
      wrongFileDim : 'Գրաֆիկական ֆայլի սխալ չափս,',
      imageTooTall : 'պատկերը չի կարող լինել ավելի նեղ, քան',
      imageTooWide : 'պատկերը չի կարող լինել ավելի լայն, քան',
      imageTooSmall : 'պատկերը չափազանց փոքր է',
      min : 'նվազագույնը',
      max : 'առավելագույնը',
      imageRatioNotAccepted : 'Նման կողմերի հարաբերությամբ պատկեր չի ընդունվում',
      badBrazilTelephoneAnswer: 'Ներմուծված հեռախոսահամարը սխալ է',
      badBrazilCEPAnswer: 'CEP-ի սխալ',
      badBrazilCPFAnswer: 'CPF-ի սխալ'
    };

  });

})(jQuery, window);
