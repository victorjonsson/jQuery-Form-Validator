/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * German language package
 *
 * @website http://formvalidator.net/
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @version 2.2.23
 */
(function($, window) {

  "use strict";

  $(window).bind('validatorsLoaded', function() {

    $.formUtils.LANG = {
      errorTitle: "Ihre Anfrage konnte nicht gesendet werden!",
      requiredFields: "Sie haben nicht alle Fragen beantwortet",
      badTime: "Sie haben nicht die korrekte Zeit eingegeben",
      badEmail: "Sie haben keine gültige E-Mail-Adresse eingegeben",
      badTelephone: "Sie haben nicht die richtige Telefonnummer eingetragen",
      badSecurityAnswer: "Sie haben die falsche Antwort auf die Sicherheitsfrage eingegeben",
      badDate: "Re-Eingabe ein falsches Datum",
      lengthBadStart: "Ihre Antwort muss zwischen schließen",
      lengthBadEnd: " Zeichen",
      lengthTooLongStart: "Sie haben eine Antwort, die länger als angegeben",
      lengthTooShortStart: "Sie haben eine Antwort, die kürzer ist als eingegebene",
      notConfirmed: "Die Antworten könnten nicht gegenseitig bestätigen,",
      badDomain: "Sie haben die falsche Domäne eingetragen",
      badUrl: "Sie haben nicht das richtige URL eingegeben",
      badCustomVal: "Re-Eingabe eine falsche Antwort",
      andSpaces: " und Räume",
      badInt: "Sie haben keine Nummer eingegeben",
      badSecurityNumber: "Sie haben eine falsche Sozialversicherungsnummer eingegeben",
      badUKVatAnswer: "Sie haben keine UK Umsatzsteuer-Identifikationsnummer eingegeben",
      badStrength: "Sie haben ein Kennwort, das nicht sicher genug eingegeben",
      badNumberOfSelectedOptionsStart: "Sie müssen mindestens wählen",
      badNumberOfSelectedOptionsEnd: " Antwort",
      badAlphaNumeric: "Sie können nur mit alfanumersika Zeichen (az und Zahlen) zu reagieren",
      badAlphaNumericExtra: " und",
      wrongFileSize: "Die Datei, die Sie hochzuladen versuchen, zu groß ist (max %s)",
      wrongFileType: "Nur Dateien vom Typ %s ist zulässig",
      groupCheckedRangeStart: "Wählen Sie zwischen",
      groupCheckedTooFewStart: "Dann müssen Sie zumindest sicher,",
      groupCheckedTooManyStart: "Sie können nicht mehr als zu machen",
      groupCheckedEnd: " Auswahl",
      badCreditCard: "Sie haben eine ungültige Kreditkartennummer eingegeben",
      badCVV: "Sie haben eine falsche CVV eingegeben",
      wrongFileDim: "Illegal Bildgröße,",
      imageTooTall: "Das Bild kann nicht höher als sein",
      imageTooWide: "Das Bild kann nicht breiter als sein",
      imageTooSmall: "das Bild zu klein ist,",
      min: "am wenigsten",
      max: "max"
    };

  });

})(jQuery, window);


