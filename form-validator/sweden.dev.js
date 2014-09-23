/**
 * jQuery Form Validator Module: Security
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 *
 * This form validation module adds validators typically used on swedish
 * websites. This module adds the following validators:
 *  - validate_swesec (Social security number)
 *  - validate_swemobile
 *  - validate_validate_municipality
 *  - validate_county
 *  - validate_swephone
 *
 * @website http://formvalidator.net/#swedish-validators
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @version 2.2.beta.14
 */
(function($, window) {

    /*
    * Validate swedish social security number yyyymmddXXXX
    */
    $.formUtils.addValidator({
        name : 'swesec',
        validatorFunction : function(securityNumber, $input) {

            var year, month, day, ssnParts;

            if( $input.valAttr('use-hyphen') ) {
                ssnParts = securityNumber.split('-');
                if( ssnParts.length != 2 ) {
                    return false;
                }
                securityNumber = ssnParts.join('');
            }

            if (!securityNumber.match(/^(\d{4})(\d{2})(\d{2})(\d{4})$/)) {
                return false;
            }

            year = RegExp.$1;
            month = $.formUtils.parseDateInt(RegExp.$2);
            day = $.formUtils.parseDateInt(RegExp.$3);

            window.ssnGender = ( parseInt( (RegExp.$4).substring(2,3) ) % 2 ) === 0 ? 'female':'male';

            var months = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
                months[1] = 29;
            }
            if (month < 1 || month > 12 || day < 1 || day > months[month - 1]) {
                return false;
            }

            securityNumber = securityNumber.substring(2, securityNumber.length);
            var check = '';
            for (var i = 0; i < securityNumber.length; i++) {
                check += ((((i + 1) % 2) + 1)* securityNumber.substring(i, i + 1));
            }
            var checksum = 0;
            for (i = 0; i < check.length; i++) {
                checksum += parseInt(check.substring(i, i + 1),10);
            }

            return checksum % 10 === 0;
        },
        errorMessage : '',
        errorMessageKey: 'badSecurityNumber'
    });

    $.formUtils.addValidator({
        name : 'swecounty',
        validatorFunction : function(str) {
            str = str.toLowerCase();
            if($.inArray(str, this.counties) == -1) {
                if(str.substr(-3).toLocaleLowerCase() != 'län') {
                    return $.inArray(str + 's län', this.counties) > -1;
                }

                return false;
            }
            else
                return true;
        },
        errorMessage: '',
        errorMessageKey: 'badCustomVal',
        counties : ['stockholms län',
            'uppsala län',
            'södermanlands län',
            'östergötlands län',
            'jönköpings län',
            'kronobergs län',
            'kalmar län',
            'gotlands län',
            'blekinge län',
            'skåne län',
            'hallands län',
            'västra götalands län',
            'värmlands län',
            'örebro län',
            'västmanlands län',
            'dalarnas län',
            'gävleborgs län',
            'västernorrlands län',
            'jämtlands län',
            'västerbottens län',
            'norrbottens län']
    });

    $.formUtils.addValidator({
        name : 'swemunicipality',
        validatorFunction : function(str) {
            str = str.toLowerCase();
            if($.inArray(str, this.municipalities) == -1) {

                // First check (dont return)
                if(str.substr(-8) == 's kommun') {
                    if($.inArray( str.substr(0, str.length-8), this.municipalities ) > -1)
                        return true;
                }

                // Second check
                if(str.substr(-7) == ' kommun') {
                    return $.inArray( str.substr(0, str.length-7), this.municipalities ) > -1;
                }

                return false;
            }
            else
                return true;
        },
        errorMessage : '',
        errorMessageKey: 'badCustomVal',
        municipalities : ['ale','alingsås','alvesta','aneby','arboga','arjeplog','arvidsjaur','arvika','askersund','avesta','bengtsfors','berg','bjurholm','bjuv','boden','bollebygd','bollnäs','borgholm','borlänge','borås','botkyrka','boxholm','bromölla','bräcke','burlöv','båstad','dals-ed','danderyd','degerfors','dorotea','eda','ekerö','eksjö','emmaboda','enköpings','eskilstuna','eslövs','essunga','fagersta','falkenberg','falköping','falu','filipstad','finspång','flen','forshaga','färgelanda','gagnef','gislaved','gnesta','gnosjö','gotland','grum','grästorp','gullspång','gällivare','gävle','göteborg','götene','habo','hagfor','hallsberg','hallstahammar','halmstad','hammarö','haninge','haparanda','heby','hedemora','helsingborg','herrljunga','hjo','hofor','huddinge','hudiksvall','hultsfred','hylte','håbo','hällefor','härjedalen','härnösand','härryda','hässleholm','höganäs','högsby','hörby','höör','jokkmokk','järfälla','jönköping','kalix','kalmar','karlsborg','karlshamn','karlskoga','karlskrona','karlstad','katrineholm','kil','kinda','kiruna','klippan','knivsta','kramfors','kristianstad','kristinehamn','krokoms','kumla','kungsbacka','kungsör','kungälv','kävlinge','köping','laholm','landskrona','laxå','lekeberg','leksand','lerum','lessebo','lidingö','lidköping','lilla edets','lindesbergs','linköpings','ljungby','ljusdals','ljusnarsbergs','lomma','ludvika','luleå','lunds','lycksele','lysekil','malmö','malung-sälen','malå','mariestad','marks','markaryd','mellerud','mjölby','mora','motala','mullsjö','munkedal','munkfors','mölndal','mönsterås','mörbylånga','nacka','nora','norberg','nordanstig','nordmaling','norrköping','norrtälje','norsjö','nybro','nykvarn','nyköping','nynäshamn','nässjö','ockelbo','olofström','orsa','orust','osby','oskarshamn','ovanåker','oxelösund','pajala','partille','perstorp','piteå','ragunda','robertsfors','ronneby','rättvik','sala','salem','sandviken','sigtuna','simrishamn','sjöbo','skara','skellefteå','skinnskatteberg','skurup','skövde','smedjebacken','sollefteå','sollentuna','solna','sorsele','sotenäs','staffanstorp','stenungsund','stockholm','storfors','storuman','strängnäs','strömstad','strömsund','sundbyberg','sundsvall','sunne','surahammar','svalöv','svedala','svenljunga','säffle','säter','sävsjö','söderhamns','söderköping','södertälje','sölvesborg','tanum','tibro','tidaholm','tierp','timrå','tingsryd','tjörn','tomelilla','torsby','torså','tranemo','tranå','trelleborg','trollhättan','trosa','tyresö','täby','töreboda','uddevalla','ulricehamns','umeå','upplands väsby','upplands-bro','uppsala','uppvidinge','vadstena','vaggeryd','valdemarsvik','vallentuna','vansbro','vara','varberg','vaxholm','vellinge','vetlanda','vilhelmina','vimmerby','vindeln','vingåker','vårgårda','vänersborg','vännäs','värmdö','värnamo','västervik','västerås','växjö','ydre','ystad','åmål','ånge','åre','årjäng','åsele','åstorp','åtvidaberg','älmhult','älvdalen','älvkarleby','älvsbyn','ängelholm','öckerö','ödeshög','örebro','örkelljunga','örnsköldsvik','östersund','österåker','östhammar','östra göinge','överkalix','övertorneå']
    });


    /*
     * Validate phone number, at least 7 digits only one hyphen and plus allowed
     */
    $.formUtils.addValidator({
        name : 'swephone',
        validatorFunction : function(tele) {
            var numPlus = tele.match(/\+/g);
            var numHifen = tele.match(/-/g);

            if ((numPlus !== null && numPlus.length > 1) || (numHifen !== null && numHifen.length > 1)) {
                return false;
            }
            if (numPlus !== null && tele.indexOf('+') !== 0) {
                return false;
            }

            tele = tele.replace(/([-|\+])/g, '');
            return tele.length > 8 && tele.match(/[^0-9]/g) === null;
        },
        errorMessage : '',
        errorMessageKey: 'badTelephone'
    });


    /*
     * Validate that string is a swedish telephone number
     */
    $.formUtils.addValidator({
        name : 'swemobile',
        validatorFunction : function(number) {
            if (!$.formUtils.validators.validate_swephone.validatorFunction(number)) {
                return false;
            }

            number = number.replace(/[^0-9]/g, '');
            var begin = number.substring(0, 3);

            if (number.length != 10 && begin !== '467') {
                return false;
            } else if (number.length != 11 && begin === '467') {
                return false;
            }
            return (/07[0-9{1}]/).test(begin) || begin === '467';
        },
        errorMessage : '',
        errorMessageKey: 'badTelephone'
    });

    /**
     * @private
     * @param {Array} listItems
     * @return {Array}
     */
    var _makeSortedList = function(listItems) {
        var newList = [];
        $.each(listItems, function(i, v) {
            newList.push(v.substr(0,1).toUpperCase() + v.substr(1, v.length));
        });
        newList.sort();
        return newList;
    };

    $.fn.suggestSwedishCounty = function(settings) {
        var counties = _makeSortedList($.formUtils.validators.validate_swecounty.counties);
        return $.formUtils.suggest(this, counties, settings);
    };

    $.fn.suggestSwedishMunicipality = function(settings) {
        var municipalities = _makeSortedList($.formUtils.validators.validate_swemunicipality.municipalities);
        return $.formUtils.suggest(this, municipalities, settings);
    };

})(jQuery, window);