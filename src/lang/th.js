/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * Spanish language package
 *
 * @website http://formvalidator.net/
 * @license MIT
 */
(function($, window) {

  'use strict';

  $.formUtils.registerLoadedModule('lang/th');

  $(window).bind('validatorsLoaded', function() {

    $.formUtils.LANG = {
      errorTitle: 'การส่งฟอร์มไม่สำเร็จ!',
      requiredFields: 'คุณต้องกรอกข้อมูลที่จำเป็นทั้งหมด',
      badTime: 'คุณกรอกเวลาไม่ถูกต้อง',
      badEmail: 'คุณกรอกอีเมลไม่ถูกต้อง',
      badTelephone: 'คุณกรอกหมายเลขโทรศัพท์ไม่ถูกต้อง',
      badSecurityAnswer: 'คุณตอบคำถามเพื่อความปลอดภัยไม่ถูกต้อง',
      badDate: 'คุณกรอกวันที่ไม่ถูกต้อง',
      lengthBadStart: 'ข้อมูลที่กรอกจะต้องอยู่ระหว่าง ',
      lengthBadEnd: ' ตัวอักษร',
      lengthTooLongStart: 'ข้อมูลที่กรอกมีความยาวมากกว่า ',
      lengthTooShortStart: 'ข้อมูลที่กรอกมีความยาวน้อยกว่า ',
      notConfirmed: 'คุณกรอกข้อมูลยืนยันไม่ถูกต้อง',
      badDomain: 'โดเมนไม่ถูกต้อง',
      badUrl: 'ข้อมูลที่กรอกไม่ใช่ URL ที่ถูกต้อง',
      badCustomVal: 'ข้อมูลที่กรอกไม่ถูกต้อง',
      andSpaces: ' และช่องว่าง ',
      badInt: 'คุณกรอกตัวเลขไม่ถูกต้อง',
      badSecurityNumber: 'หมายเลขประกันสังคมของคุณไม่ถูกต้อง',
      badUKVatAnswer: 'หมายเลข VAT ของสหราชอาณาจักรไม่ถูกต้อง',
      badStrength: 'รหัสผ่านไม่มีความปลอดภัย',
      badNumberOfSelectedOptionsStart: 'คุณต้องเลือกอย่างน้อย ',
      badNumberOfSelectedOptionsEnd: ' คำตอบ',
      badAlphaNumeric: 'ข้อมูลที่กรอกสามารถมีได้เฉพาะตัวอักษรและตัวเลขเท่านั้น ',
      badAlphaNumericExtra: ' และ ',
      wrongFileSize: 'ไฟล์ที่คุณอัพโหลดมีขนาดใหญ่เกินไป (ขนาดไม่เกิน %s)',
      wrongFileType: 'อนุญาตเฉพาะไฟล์ประเภท %s เท่านั้น',
      groupCheckedRangeStart: 'เลือกระหว่าง ',
      groupCheckedTooFewStart: 'เลือกอย่างน้อย ',
      groupCheckedTooManyStart: 'เลือกได้มากสุด ',
      groupCheckedEnd: ' ข้อ',
      badCreditCard: 'หมายเลขบัตรเครดิตไม่ถูกต้อง',
      badCVV: 'หมายเลข CVV ไม่ถูกต้อง',
      wrongFileDim: 'ขนาดภาพไม่ถูกต้อง,',
      imageTooTall: 'ภาพจะต้องสูงไม่เกิน',
      imageTooWide: 'ภาพจะต้องกว้างไม่เกิน',
      imageTooSmall: 'ภาพมีขนาดเล็กเกินไป',
      min: 'ขั้นต่ำ',
      max: 'สูงสุด',
      imageRatioNotAccepted: 'ไม่ยอมรับอัตราส่วนภาพนี้'
    };

  });

})(jQuery, window);
