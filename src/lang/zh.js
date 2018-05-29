/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * China language package
 *
 * @website http://formvalidator.net/
 * @license MIT
 */
(function($, window) {

  'use strict';

  $.formUtils.registerLoadedModule('lang/vi');

  $(window).bind('validatorsLoaded', function() {

    $.formUtils.LANG = {
      errorTitle: '表单提交失败!',
      requiredField: '这是个必填字段',
      requiredFields: '您没有回答完所有的问题',
      badTime: '您填写了一个错误的时间',
      badEmail: '您填写的邮箱地址格式错误',
      badTelephone: '您填写的手机号格式错误',
      badSecurityAnswer: '您填写的答案错误',
      badDate: '您填写的日期错误',
      lengthBadStart: '填写的值必须在 ',
      lengthBadEnd: ' 字符',
      lengthTooLongStart: '填写的值要大于 ',
      lengthTooShortStart: '填写的值要小于 ',
      notConfirmed: '输入的内容不一致',
      badDomain: '错误的域名',
      badUrl: '不是一个正确的URL',
      badCustomVal: '输入的值不正确',
      andSpaces: ' 和字符 ',
      badInt: '输入的值不是一个正确的整数',
      badSecurityNumber: '您的信用卡卡号不正确',
      badUKVatAnswer: '错误的 UK VAT Number',
      badUKNin: '错误的 UK NIN',
      badUKUtr: '错误的 UK UTR Number',
      badStrength: '密码太弱',
      badNumberOfSelectedOptionsStart: '您至少要选择 ',
      badNumberOfSelectedOptionsEnd: ' 选项',
      badAlphaNumeric: '填写的值只能是字母数字的组合 ',
      badAlphaNumericExtra: ' 和 ',
      wrongFileSize: '您要上传的文件太大(最大 %s)',
      wrongFileType: '文件类型是 %s 才被允许上传',
      groupCheckedRangeStart: '请选择范围在 ',
      groupCheckedTooFewStart: '请至少选择 ',
      groupCheckedTooManyStart: '请最多选择 ',
      groupCheckedEnd: ' 项目(s)',
      badCreditCard: '信用卡号码不正确',
      badCVV: 'CVV 号码不正确',
      wrongFileDim : '图像尺寸错误,',
      imageTooTall : '图像不能高于',
      imageTooWide : '图像不能宽于',
      imageTooSmall : '图像太小',
      min : '最小',
      max : '最大',
      imageRatioNotAccepted : '图片的比列不允许',
      badBrazilTelephoneAnswer: '手机号格式错误',
      badBrazilCEPAnswer: 'CEP 输入无效',
      badBrazilCPFAnswer: 'CPF 输入无效',
      badPlPesel: 'PESEL 输入无效',
      badPlNip: 'NIP 输入无效',
      badPlRegon: 'The REGON 输入无效',
      badreCaptcha: 'Please confirm that you are not a bot',
      passwordComplexityStart: '密码必须至少要包含 ',
      passwordComplexitySeparator: ', ',
      passwordComplexityUppercaseInfo: ' 大写字母(s)',
      passwordComplexityLowercaseInfo: ' 小写字母(s)',
      passwordComplexitySpecialCharsInfo: ' 特殊字符(s)',
      passwordComplexityNumericCharsInfo: ' 数字字符(s)',
      passwordComplexityEnd: '.'
    };

  });

})(jQuery, window);
