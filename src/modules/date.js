/**
 * jQuery Form Validator Module: Date
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 * Documentation and issue tracking on Github <https://github.com/victorjonsson/jQuery-Form-Validator/>
 *
 * The following validators will be added by this module:
 *  - Time (HH:mmm)
 *  - Birth date
 *
 * @website http://formvalidator.net/#location-validators
 * @license MIT
 */
(function ($) {

  $.formUtils.registerLoadedModule('date');

  /*
   * Validate time hh:mm
   */
  $.formUtils.addValidator({
    name: 'time',
    validatorFunction: function (time) {
      if (time.match(/^(\d{2}):(\d{2})$/) === null) {
        return false;
      } else {
        var hours = parseInt(time.split(':')[0], 10);
        var minutes = parseInt(time.split(':')[1], 10);
        if (hours > 23 || minutes > 59) {
          return false;
        }
      }
      return true;
    },
    errorMessage: '',
    errorMessageKey: 'badTime'
  });

  /*
   * Is this a valid birth date
   */
  $.formUtils.addValidator({
    name: 'birthdate',
    validatorFunction: function (val, $el, conf) {
      var dateFormat = 'yyyy-mm-dd';
      if ($el.valAttr('format')) {
        dateFormat = $el.valAttr('format');
      }
      else if (typeof conf.dateFormat !== 'undefined') {
        dateFormat = conf.dateFormat;
      }

      var inputDate = $.formUtils.parseDate(val, dateFormat);
      if (!inputDate) {
        return false;
      }

      var year = inputDate[0],
        month = inputDate[1],
        day = inputDate[2],
        age = getAge(year, month, day),
        allowedAgeRange = ($el.valAttr('age-range') || '0-124').split('-');

      if (allowedAgeRange.length !== 2 || !$.isNumeric(allowedAgeRange[0]) || !$.isNumeric(allowedAgeRange[1])) {
        throw new Error('Date range format invalid');
      }

      return age >= allowedAgeRange[0] && age <= allowedAgeRange[1];
    },
    errorMessage: '',
    errorMessageKey: 'badDate'
  });


  function getAge(otherDateYear, otherDateMonth, otherDateDay) {
    var otherDate = new Date(),
      nowDate = new Date();
    otherDate.setYear(otherDateYear);
    otherDate.setMonth(otherDateMonth);
    otherDate.setDate(otherDateDay);
    return new Date(nowDate.getTime() - otherDate.getTime()).getUTCFullYear() - 1970;
  }

})(jQuery);
