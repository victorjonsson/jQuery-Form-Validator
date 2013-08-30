/**
* jQuery Form Validator
* ------------------------------------------
* Created by Victor Jonsson <http://www.victorjonsson.se>
*
* @website http://formvalidator.net/
* @license Dual licensed under the MIT or GPL Version 2 licenses
* @version 2.1.8
*/
(function($) {

    'use strict';

    /**
    * Assigns validateInputOnBlur function to elements blur event
    *
    * @param {Object} language Optional, will override $.formUtils.LANG
    * @param {Object} settings Optional, will override the default settings
    * @return {jQuery}
    */
    $.fn.validateOnBlur = function(language, settings) {
        this.find('input[data-validation], textarea[data-validation]')
            .blur(function() {
               $(this).validateInputOnBlur(language, settings);
            });
        return this;
    };

    /**
    * fade in help message when input gains focus
    * fade out when input loses focus
    * <input data-help="The info that I want to display for the user when input is focused" ... />
    *
    * @param {String} attrName - Optional, default is data-help
    * @return {jQuery}
    */
    $.fn.showHelpOnFocus = function(attrName) {
        if(!attrName) {
            attrName = 'data-validation-help';
        }

        this.find('textarea,input').each(function() {
            var $element = $(this),
                className = 'jquery_form_help_' + $element.attr('name'),
                help = $element.attr(attrName);
            if(help) {
                $element
                    .focus(function() {
                        var $help = $element.parent().find('.'+className);
                        if($help.length == 0) {
                            $help = $('<span />')
                                        .addClass(className)
                                        .addClass('help-block') // twitter bs
                                        .text(help)
                                        .hide();

                            $element.after($help);

                        }
                        $help.fadeIn();
                    })
                    .blur(function() {
                        $(this)
                            .parent()
                            .find('.'+className)
                                .fadeOut('slow');
                    });
            }
        });

        return this;
    };

    /**
    * Validate single input when it loses focus
    * shows error message in a span element 
    * that is appended to the parent element
    *
    * @param {Object} [language] Optional, will override $.formUtils.LANG
    * @param {Object} [config] Optional, will override the default settings
    * @param {Boolean} [attachKeyupEvent] Optional
    * @return {jQuery}
    */
    $.fn.validateInputOnBlur = function(language, config, attachKeyupEvent) {
        if(attachKeyupEvent === undefined) {
            attachKeyupEvent = true;
        }

        language = $.extend($.formUtils.LANG, language || {});
        config = $.extend($.formUtils.defaultConfig(), config || {});
        config.errorMessagePosition = 'element';

        var $element = this,

            // test if there is custom obj to hold element error msg (id = element name + err_msg)
            elementErrMsgObj = document.getElementById($element.attr('name')+'_err_msg'),

            $form = $element.closest("form"),

            validationRule = $element.attr(config.validationRuleAttribute);

        if( !attachKeyupEvent && validationRule == 'server' ) {
            // do not validate server side on keyup event
            return this;
        }

        // Remove possible error style applied by previous validation
        $element
            .removeClass(config.errorElementClass)
            .css('border-color', '')
            .parent()
            .find('.'+config.errorMessageClass).remove();

        // Twitter bs
        $form.find('.has-error').removeClass('has-error');

        // if element has custom err msg container, clear it
        if( elementErrMsgObj != null) {
            elementErrMsgObj.innerHTML = '';
        }

        var validation = $.formUtils.validateInput($element, language, config, $form);

        if(validation === true) {
            $element
                .addClass('valid')
                .parent()
                    .addClass('has-success'); // twitter bs
        } else if(validation === null) {
            $element
                .removeClass('valid')
                .parent()
                    .removeClass('has-error')
                    .removeClass('has-success');
        } else {
            $element
                .addClass(config.errorElementClass)
                .removeClass('valid')
                .parent()
                    .addClass('has-error')
                    .removeClass('has-success'); // twitter bs

            // if element has custom err msg container, use it
            if( elementErrMsgObj != null) {
                elementErrMsgObj.innerHTML = validation;
            } else { // use regular span append
                var $parent = $element.parent();
                $parent.append('<span class="'+config.errorMessageClass+' help-block">'+validation+'</span>');
                $parent.addClass('has-error'); // twitter bs
            }

            if(config.borderColorOnError !== '') {
                $element.css('border-color', config.borderColorOnError);
            }

            if(attachKeyupEvent) {
                $element.bind('keyup', function() {
                    $(this).validateInputOnBlur(language, config, false);
                });
            }
        }

        return this;
    };

    /**
     * Short hand for fetching/adding/removing element attributes
     * prefixed with 'data-validation-'
     *
     * @param {String} name
     * @param {String|Boolean} [val]
     * @return string|undefined
     * @protected
     */
    $.fn.valAttr = function(name, val) {
        if( val === undefined ) {
            return this.attr('data-validation-'+name);
        } else if( val === false || val === null ) {
            return this.removeAttr('data-validation-'+name);
        } else {
            if(name.length > 0) name='-'+name;
            return this.attr('data-validation'+name, val);
        }
    };

    /**
     * Function that validate all inputs in a form
     *
     * @param [language]
     * @param [config]
     */
    $.fn.validateForm = function(language, config) {

        language = $.extend($.formUtils.LANG, language || {});
        config = $.extend($.formUtils.defaultConfig(), config || {});

        $.formUtils.isValidatingEntireForm = true;
        $.formUtils.haltValidation = false;

        /**
         * Adds message to error message stack if not already in the message stack
         *
         * @param {String} mess
         * @para {jQuery} $element
         */
        var addErrorMessage = function(mess, $element) {
            if ($.inArray(mess, errorMessages) < 0) {
                errorMessages.push(mess);
            }
            errorInputs.push($element);
            $element
                .valAttr('current-error', mess)
                .removeClass('valid')
                .parent()
                    .removeClass('has-success');
        },

        /** Error messages for this validation */
        errorMessages = [],

        /** Input elements which value was not valid */
        errorInputs = [],

        /** Form instance */
        $form = this,

        /**
         * Tells whether or not to validate element with this name and of this type
         *
         * @param {String} name
         * @param {String} type
         * @return {Boolean}
         */
        ignoreInput = function(name, type) {
            if (type === 'submit' || type === 'button') {
                return true;
            }
            return $.inArray(name, config.ignore || []) > -1;
        };

        //
        // Validate element values
        //
        $form.find('input,textarea,select').filter(':not([type="submit"],[type="button"])').each(function() {
            var $element = $(this);
            var elementType = $element.attr('type');
            if (!ignoreInput($element.attr('name'), elementType)) {

                var validation = $.formUtils.validateInput(
                                $element,
                                language,
                                config,
                                $form
                            );

                if(validation !== true) {
                    addErrorMessage(validation, $element);
                } else {
                    $element
                        .valAttr('current-error', false)
                        .addClass('valid')
                        .parent()
                            .addClass('has-success');
                }
            }

        });

        //
        // Reset style and remove error class
        //
        $form.find('.has-error').removeClass('has-error');
        $form.find('input,textarea,select')
            .css('border-color', '')
            .removeClass(config.errorElementClass);

        //
        // Remove possible error messages from last validation
        //
        $('.' + $.split(config.errorMessageClass, ' ').join('.')).remove();
        $('.'+config.errorMessageClass).remove();

        //
        // Run validation callback
        //
        if( typeof config.onValidate == 'function' ) {
            var resp = config.onValidate($form);
            if( resp && resp.element && resp.message ) {
                addErrorMessage(resp.message, resp.element);
            }
        }

        //
        // Validation failed
        //
        if (!$.formUtils.haltValidation && errorInputs.length > 0) {

            // Reset form validation flag
            $.formUtils.isValidatingEntireForm = false;

            // Apply error style to invalid inputs
            $.each(errorInputs, function(i, $input) {
                if (config.borderColorOnError !== '') {
                    $input.css('border-color', config.borderColorOnError);
                }
                $input
                    .addClass(config.errorElementClass)
                    .parent()
                        .addClass('has-error');
            });

            // display all error messages in top of form
            if (config.errorMessagePosition === 'top') {
                var messages = '<strong>' + language.errorTitle + '</strong>';
                $.each(errorMessages, function(i, mess) {
                    messages += '<br />* ' + mess;
                });

                // using div instead of P gives better control of css display properties
                $form.children().eq(0).before('<div class="' + config.errorMessageClass + ' alert alert-danger">' + messages + '</div>');
                if(config.scrollToTopOnError) {
                    $(window).scrollTop($form.offset().top - 20);
                }
            }

            // Display error message below input field
            else {
                $.each(errorInputs, function(i, $input) {
                    var $parent = $input.parent(),
                        $errorSpan = $parent.find('span[class='+config.errorMessageClass+']');
                    if ($errorSpan.length > 0) {
                        $errorSpan.text(', '+$input.valAttr('current-error'));
                    } else {
                        $parent.append('<span class="'+config.errorMessageClass+' help-block">' + $input.valAttr('current-error') + '</span>');
                    }
                });
            }
            return false;
        }

        // Reset form validation flag
        $.formUtils.isValidatingEntireForm = false;

        return !$.formUtils.haltValidation;
    };

    /**
    * Plugin for displaying input length restriction
    */
    $.fn.restrictLength = function(maxLengthElement) {
        new $.formUtils.lengthRestriction(this, maxLengthElement);
        return this;
    };

    /**
     * Add suggestion dropdown to inputs having data-suggestions with a comma
     * separated string with suggestions
     * @param {Array} [settings]
     * @returns {jQuery}
     */
    $.fn.addSuggestions = function(settings) {
        var sugs = false;
        this.find('input').each(function() {
            var $field = $(this);

            sugs = $.split($field.attr('data-suggestions'));

            if( sugs.length > 0 ) {
                $.formUtils.suggest($field, sugs, settings);
            }
        });
        return this;
    };

    /**
     * A bit smarter split function
     * @param {String} val
     * @param {Function|String} [func]
     * @param {String} [delim]
     * @returns {Array|void}
     */
    $.split = function(val, func, delim) {
        if( typeof func != 'function' ) {
            // return string
            if( !val )
                return [];
            var values = [];
            $.each(val.split(func ? func:','), function(i,str) {
                str = $.trim(str);
                if( str.length )
                    values.push(str);
            });
            return values;
        } else if( val ) {
            // use callback on each
            if( !delim )
                delim = ',';
            $.each(val.split(delim), function(i, str) {
                str = $.trim(str);
                if( str.length )
                    return func(str, i);
            });
        }
    };

    /**
     * Short hand function that makes the validation setup require less code
     * @param config
     */
    $.validate = function(config) {
        config = $.extend({
            form : 'form',
            validateOnBlur : true,
            showHelpOnFocus : true,
            addSuggestions : true,
            modules : '',
            onModulesLoaded : null,
            language : false,
            onSuccess : false,
            onError : false
        }, config || {});

        $.split(config.form, function(formQuery) {
            var $form  = $(formQuery);

            // Validate when submitted
            $form.bind('submit', function() {
                if($.formUtils.isLoadingModules) {
                    setTimeout(function() {
                        $form.trigger('submit');
                    }, 200);
                    return false;
                }
                var valid = $(this).validateForm(config.language, config);
                if( valid && typeof config.onSuccess == 'function') {
                    var callbackResponse = config.onSuccess($form);
                    if( callbackResponse === false )
                        return false;
                } else if ( !valid && typeof config.onError == 'function' ) {
                    config.onError($form);
                    return false;
                } else {
                    return valid;
                }
            });

            if( config.validateOnBlur ) {
                $form.validateOnBlur(config.language, config);
            }
            if( config.showHelpOnFocus ) {
                $form.showHelpOnFocus();
            }
            if( config.addSuggestions ) {
                $form.addSuggestions();
            }
        });

        if( config.modules != '' ) {
            if( typeof config.onModulesLoaded == 'function' ) {
                $.formUtils.on('load', function() {
                    config.onModulesLoaded();
                });
            }
            $.formUtils.loadModules(config.modules);
        }
    };

    /**
     * @deprecated
     * @param {Object} config
     */
    $.validationSetup = function(config) {
        if( typeof console != 'undefined' && console.warn ) {
            window.console.warn('Using deprecated function $.validationSetup, pls use $.validate instead');
        }
        $.validate(config);
    };

    /**
     * Object containing utility methods for this plugin
     */
    $.formUtils = {

        /**
         * Default config for $(...).validateForm();
         */
        defaultConfig :  function() {
            return {
                ignore : [], // Names of inputs not to be validated even though node attribute containing the validation rules tells us to
                errorElementClass : 'error', // Class that will be put on elements which value is invalid
                borderColorOnError : 'red', // Border color of elements which value is invalid, empty string to not change border color
                errorMessageClass : 'form-error', // class name of div containing error messages when validation fails
                validationRuleAttribute : 'data-validation', // name of the attribute holding the validation rules
                validationErrorMsgAttribute : 'data-validation-error-msg', // define custom err msg inline with element
                errorMessagePosition : 'element', // Can be either "top" or "element"
                scrollToTopOnError : true,
                dateFormat : 'yyyy-mm-dd',
                decimalSeparator : '.'
            }
        },

        /**
        * Available validators
        */
        validators : {},

        /**
         * Events triggered by form validator
         */
        _events : {load : [], valid: [], invalid:[]},

        /**
         * Setting this property to true during validation will
         * stop further validation from taking place and form will
         * not be sent
         */
        haltValidation : false,

        /**
         * This variable will be true $.fn.validateForm() is called
         * and false when $.fn.validateOnBlur is called
         */
        isValidatingEntireForm : false,

        /**
        * Function for adding a validator
        * @param {Object} validator
        */
        addValidator : function(validator) {
            // prefix with "validate_" for backward compatibility reasons
            var name = validator.name.indexOf('validate_') === 0 ? validator.name : 'validate_'+validator.name;
            this.validators[name] = validator;
        },

        /**
         * @param {String} evt
         * @param {Function} callback
         */
        on : function(evt, callback) {
            // Why not use $(document).bind('validators.loaded', func);
            if( this._events[evt] === undefined )
                this._events[evt] = [];
            this._events[evt].push(callback);
        },

        /**
         * @param {String} evt
         * @param [argA]
         * @param [argB]
         */
        trigger : function(evt, argA, argB) {
            $.each(this._events[evt] || [], function(i, func) {
                func(argA, argB);
            });
        },

        /**
         * @ {Boolean}
         */
        isLoadingModules : false,

        /**
        * @example
        *  $.formUtils.loadModules('date, security.dev');
        *
        * Will load the scripts date.js and security.dev.js from the
        * directory where this script resides. If you want to load
        * the modules from another directory you can use the
        * path argument.
        *
        * The script will be cached by the browser unless the module
        * name ends with .dev
        *
        * @param {String} modules - Comma separated string with module file names (no directory nor file extension)
        * @param {String} [path] - Optional, path where the module files is located if their not in the same directory as the core modules
        * @param {Boolean} [fireEvent] - Optional, whether or not to fire event 'load' when modules finished loading
        */
        loadModules : function(modules, path, fireEvent) {

            if( fireEvent === undefined )
                fireEvent = true;

            if( $.formUtils.isLoadingModules ) {
                setTimeout(function() {
                    $.formUtils.loadModules(modules, path, fireEvent);
                });
                return;
            }

            var loadModuleScripts = function(modules, path) {
                var moduleList = $.split(modules),
                    numModules = moduleList.length,
                    moduleLoadedCallback = function() {
                        numModules--;
                        if( numModules == 0 ) {
                            $.formUtils.isLoadingModules = false;
                            if( fireEvent ) {
                                $.formUtils.trigger('load', path);
                            }
                        }
                    };

                if( numModules > 0 ) {
                    $.formUtils.isLoadingModules = true;
                }

                var cacheSuffix = '?__='+( new Date().getTime() ),
                    appendToElement = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];

                $.each(moduleList, function(i, modName) {
                    modName = $.trim(modName);
                    if( modName.length == 0 ) {
                        moduleLoadedCallback();
                    }
                    else {
                        var scriptUrl = path + modName + (modName.substr(-3) == '.js' ? '':'.js'),
                            script = document.createElement('SCRIPT');
                        script.type = 'text/javascript';
                        script.onload = moduleLoadedCallback;
                        script.src = scriptUrl + ( scriptUrl.substr(-7) == '.dev.js' ? cacheSuffix:'' );
                        script.onreadystatechange = function() {
                            // IE 7 fix
                            if( this.readyState == 'complete' ) {
                                moduleLoadedCallback();
                            }
                        };
                        appendToElement.appendChild( script );
                    }
                });
            };

            if( path ) {
                loadModuleScripts(modules, path);
            } else {
                var findScriptPathAndLoadModules = function() {
                    var foundPath = false;
                    $('script').each(function() {
                        if( this.src ) {
                            var scriptName = this.src.substr(this.src.lastIndexOf('/')+1, this.src.length);
                            if(scriptName.indexOf('jquery.form-validator.js') > -1 || scriptName.indexOf('jquery.form-validator.min.js') > -1) {
                                foundPath = this.src.substr(0, this.src.lastIndexOf('/')) + '/';
                                if( foundPath == '/' )
                                    foundPath = '';
                                return false;
                            }
                        }
                    });

                    if( foundPath !== false) {
                        loadModuleScripts(modules, foundPath);
                        return true;
                    }
                    return false;
                };

                if( !findScriptPathAndLoadModules() ) {
                    $(findScriptPathAndLoadModules);
                }
            }
        },

        /**
        * Validate the value of given element according to the validation rules
        * found in the attribute data-validation. Will return true if valid,
        * error message otherwise
        *
        * @param {jQuery} $element
        * @param {Object} language ($.formUtils.LANG)
        * @param {Object} config
        * @param {jQuery} $form
        * @return {String|Boolean}
        */
        validateInput : function($element, language, config, $form) {

            var value = $.trim( $element.val() || ''),
                optional = $element.valAttr('optional'),

                // test if a checkbox forces this element to be validated
                validationDependsOnCheckedInput = false,
                validationDependentInputIsChecked = false,
                validateIfCheckedElement = false,

                // get value of this element's attribute "... if-checked"
                validateIfCheckedElementName = $element.valAttr("if-checked");

            // make sure we can proceed
            if (validateIfCheckedElementName != null) {

                // Set the boolean telling us that the validation depends
                // on another input being checked
                validationDependsOnCheckedInput = true;

                // select the checkbox type element in this form
                validateIfCheckedElement = $form.find('input[name="' + validateIfCheckedElementName + '"]');

                // test if it's property "checked" is checked
                if ( validateIfCheckedElement.prop('checked') ) {
                    // set value for validation checkpoint
                    validationDependentInputIsChecked = true;
                }
            }

            // validation checkpoint
            // if empty AND optional attribute is present
            // OR depending on a checkbox being checked AND checkbox is checked, return true
            if ((!value && optional === 'true') || (validationDependsOnCheckedInput && !validationDependentInputIsChecked)) {
                return null;
            }

            var validationRules = $element.attr(config.validationRuleAttribute),

                // see if form element has inline err msg attribute
                validationErrorMsg = true;

            $.split(validationRules, function(rule) {
                if( rule.indexOf('validate_') !== 0 ) {
                    rule = 'validate_' + rule;
                }

                var validator = $.formUtils.validators[rule];

                if( validator && typeof validator['validatorFunction'] == 'function' ) {
                    // special change of element for checkbox_group rule
                    if ( rule == 'validate_checkbox_group' ) {
                        // set element to first in group, so error msg is set only once
                            $element = $("[name='"+$element.attr('name')+"']:eq(0)");
                    }

                    var isValid = validator.validatorFunction(value, $element, config, language, $form);

                    if(!isValid) {
                        validationErrorMsg =  $element.attr(config.validationErrorMsgAttribute);
                        if( !validationErrorMsg ) {
                            validationErrorMsg = language[validator.errorMessageKey];
                            if( !validationErrorMsg )
                                validationErrorMsg = validator.errorMessage;
                        }
                        return false; // breaks the iteration
                    }
                } else {
                    console.warn('Using undefined validator "'+rule+'"');
                }

            }, ' ');

            if( typeof validationErrorMsg == 'string' ) {
                return validationErrorMsg;
            } else {
                return true;
            }
        },

       /**
        * Is it a correct date according to given dateFormat. Will return false if not, otherwise
        * an array 0=>year 1=>month 2=>day
        *
        * @param {String} val
        * @param {String} dateFormat
        * @return {Array}|{Boolean}
        */
        parseDate : function(val, dateFormat) {
            var divider = dateFormat.replace(/[a-zA-Z]/gi, '').substring(0,1),
                regexp = '^',
                formatParts = dateFormat.split(divider),
                matches, day, month, year;

            $.each(formatParts, function(i, part) {
               regexp += (i > 0 ? '\\'+divider:'') + '(\\d{'+part.length+'})';
            });

            regexp += '$';
            
            matches = val.match(new RegExp(regexp));
            if (matches === null) {
                return false;
            }
        
            var findDateUnit = function(unit, formatParts, matches) {
                for(var i=0; i < formatParts.length; i++) {
                    if(formatParts[i].substring(0,1) === unit) {
                        return $.formUtils.parseDateInt(matches[i+1]);
                    }
                }
                return -1;
            };
        
            month = findDateUnit('m', formatParts, matches);
            day = findDateUnit('d', formatParts, matches);
            year = findDateUnit('y', formatParts, matches);
        
            if ((month === 2 && day > 28 && (year % 4 !== 0  || year % 100 === 0 && year % 400 !== 0)) 
            	|| (month === 2 && day > 29 && (year % 4 === 0 || year % 100 !== 0 && year % 400 === 0))
            	|| month > 12 || month === 0) {
                return false;
            }
            if ((this.isShortMonth(month) && day > 30) || (!this.isShortMonth(month) && day > 31) || day === 0) {
                return false;
            }
        
            return [year, month, day];
        },

       /**
        * skum fix. är talet 05 eller lägre ger parseInt rätt int annars får man 0 när man kör parseInt?
        *
        * @param {String} val
        * @param {Number}
        */
        parseDateInt : function(val) {
            if (val.indexOf('0') === 0) {
                val = val.replace('0', '');
            }
            return parseInt(val,10);
        },

        /**
        * Has month only 30 days?
        *
        * @param {Number} m
        * @return {Boolean}
        */
        isShortMonth : function(m) {
            return (m % 2 === 0 && m < 7) || (m % 2 !== 0 && m > 7);
        },

       /**
        * Restrict input length
        *
        * @param {jQuery} $inputElement Jquery Html object
        * @param {jQuery} $maxLengthElement jQuery Html Object
        * @return void
        */
        lengthRestriction : function($inputElement, $maxLengthElement) {
                // read maxChars from counter display initial text value
           var maxChars = parseInt($maxLengthElement.text(),10),

               // internal function does the counting and sets display value
               countCharacters = function() {
                   var numChars = $inputElement.val().length;
                   if(numChars > maxChars) {
                       // get current scroll bar position
                       var currScrollTopPos = $inputElement.scrollTop();
                       // trim value to max length
                       $inputElement.val($inputElement.val().substring(0, maxChars));
                       $inputElement.scrollTop(currScrollTopPos);
                   }
                   // set counter text
                   $maxLengthElement.text(maxChars - numChars);
               };

           // bind events to this element
           // setTimeout is needed, cut or paste fires before val is available
           $($inputElement).bind('keydown keyup keypress focus blur',  countCharacters )
               .bind('cut paste', function(){ setTimeout(countCharacters, 100); } ) ;

           // count chars on pageload, if there are prefilled input-values
           $(document).bind("ready", countCharacters);
        },

        /**
        * Test numeric against allowed range
        *
        * @param $value int
        * @param $rangeAllowed str; (1-2, min1, max2)
        * @return array 
        */
        numericRangeCheck : function(value, rangeAllowed) 
        {
           // split by dash
           var range = $.split(rangeAllowed, '-');
           // min or max
           var minmax = parseInt(rangeAllowed.substr(3),10)
           // range ?
           if (range.length == 2 && (value < parseInt(range[0],10) || value > parseInt(range[1],10) ) )
           {   return [ "out", range[0], range[1] ] ; } // value is out of range
           else if (rangeAllowed.indexOf('min') === 0 && (value < minmax ) ) // min
                {  return ["min", minmax]; } // value is below min
                else if (rangeAllowed.indexOf('max') === 0 && (value > minmax ) ) // max
                     {   return ["max", minmax]; } // value is above max
           else { return [ "ok" ] ; } // value is in allowed range
        },


        _numSuggestionElements : 0,
        _selectedSuggestion : null,
        _previousTypedVal : null,

        /**
         * Utility function that can be used to create plugins that gives
         * suggestions when inputs is typed into
         * @param {jQuery} $element
         * @param {Array} suggestions
         * @param {Object} settings - Optional
         * @return {jQuery}
         */
        suggest : function($element, suggestions, settings) {
            var config =  {
                css : {
                    maxHeight: '150px',
                    background: '#FFF',
                    lineHeight:'150%',
                    textDecoration : 'underline',
                    overflowX : 'hidden',
                    overflowY : 'auto',
                    border : '#CCC solid 1px',
                    borderTop : 'none',
                    cursor: 'pointer'
                },
                activeSuggestionCSS : {
                    background : '#E9E9E9'
                }
            };

            if(settings)
                $.extend(config, settings);

            config.css['position'] = 'absolute';
            config.css['z-index'] = 9999;
            $element.attr('autocomplete', 'off');

            this._numSuggestionElements++;

            var onSelectSuggestion = function($el) {
                var suggestionId = $el.valAttr('suggestion-nr');
                $.formUtils._selectedSuggestion = null;
                $.formUtils._previousTypedVal = null;
                $('.jquery-form-suggestion-'+suggestionId).fadeOut('fast');
            };

            $element
                .data('suggestions', suggestions)
                .valAttr('suggestion-nr', this._numSuggestionElements)
                .bind('focus', function() {
                    $(this).trigger('keyup');
                    $.formUtils._selectedSuggestion = null;
                })
                .bind('keyup', function() {
                    var $input = $(this),
                        foundSuggestions = [],
                        val = $.trim($input.val()).toLocaleLowerCase();

                    if(val == $.formUtils._previousTypedVal) {
                        return;
                    }
                    else {
                        $.formUtils._previousTypedVal = val;
                    }

                    var hasTypedSuggestion = false,
                        suggestionId = $input.valAttr('suggestion-nr'),
                        $suggestionContainer = $('.jquery-form-suggestion-'+suggestionId);

                    $suggestionContainer.scrollTop(0);

                    // Find the right suggestions
                    if(val != '') {
                        var findPartial = val.length > 2;
                        $.each($input.data('suggestions'), function(i, suggestion) {
                            var lowerCaseVal = suggestion.toLocaleLowerCase();
                            if( lowerCaseVal == val ) {
                                foundSuggestions.push('<strong>'+suggestion+'</strong>');
                                hasTypedSuggestion = true;
                                return false;
                            } else if(lowerCaseVal.indexOf(val) === 0 || (findPartial && lowerCaseVal.indexOf(val) > -1)) {
                                foundSuggestions.push(suggestion.replace(new RegExp(val, 'gi'), '<strong>$&</strong>'));
                            }
                        });
                    }

                    // Hide suggestion container
                    if(hasTypedSuggestion || (foundSuggestions.length == 0 && $suggestionContainer.length > 0)) {
                        $suggestionContainer.hide();
                    }

                    // Create suggestion container if not already exists
                    else if(foundSuggestions.length > 0 && $suggestionContainer.length == 0) {
                        $suggestionContainer = $('<div></div>').css(config.css).appendTo('body');
                        $suggestionContainer.addClass('jquery-form-suggestions');
                        $suggestionContainer.addClass('jquery-form-suggestion-'+suggestionId);
                    }

                    // Show hidden container
                    else if(foundSuggestions.length > 0 && !$suggestionContainer.is(':visible')) {
                        $suggestionContainer.show();
                    }

                    // add suggestions
                    if(foundSuggestions.length > 0 && val.length != foundSuggestions[0].length) {

                        // put container in place every time, just in case
                        var offset = $input.offset();
                        $suggestionContainer.css({
                            width : $input.outerWidth(),
                            left : offset.left + 'px',
                            top : (offset.top + $input.outerHeight()) +'px'
                        });

                        // Add suggestions HTML to container
                        $suggestionContainer.html('');
                        $.each(foundSuggestions, function(i, text) {
                            $('<div></div>')
                                .append(text)
                                .css({
                                    overflow: 'hidden',
                                    textOverflow : 'ellipsis',
                                    whiteSpace : 'nowrap',
                                    padding: '5px'
                                })
                                .addClass('form-suggest-element')
                                .appendTo($suggestionContainer)
                                .click(function() {
                                    $input.focus();
                                    $input.val( $(this).text() );
                                    onSelectSuggestion($input);
                                });
                        });
                    }
                })
                .bind('keydown', function(e) {
                    var code = (e.keyCode ? e.keyCode : e.which),
                        suggestionId,
                        $suggestionContainer,
                        $input = $(this);

                    if(code == 13 && $.formUtils._selectedSuggestion !== null) {
                        suggestionId = $input.valAttr('suggestion-nr');
                        $suggestionContainer = $('.jquery-form-suggestion-'+suggestionId);
                        if($suggestionContainer.length > 0) {
                            var newText = $suggestionContainer.find('div').eq($.formUtils._selectedSuggestion).text();
                            $input.val(newText);
                            onSelectSuggestion($input);
                            e.preventDefault();
                        }
                    }
                    else {
                        suggestionId = $input.valAttr('suggestion-nr');
                        $suggestionContainer = $('.jquery-form-suggestion-'+suggestionId);
                        var $suggestions = $suggestionContainer.children();
                        if($suggestions.length > 0 && $.inArray(code, [38,40]) > -1) {
                            if(code == 38) { // key up
                                if($.formUtils._selectedSuggestion === null)
                                    $.formUtils._selectedSuggestion = $suggestions.length-1;
                                else
                                    $.formUtils._selectedSuggestion--;
                                if($.formUtils._selectedSuggestion < 0)
                                    $.formUtils._selectedSuggestion = $suggestions.length-1;
                            }
                            else if(code == 40) { // key down
                                if($.formUtils._selectedSuggestion === null)
                                    $.formUtils._selectedSuggestion = 0;
                                else
                                    $.formUtils._selectedSuggestion++;
                                if($.formUtils._selectedSuggestion > ($suggestions.length-1))
                                    $.formUtils._selectedSuggestion = 0;

                            }

                            // Scroll in suggestion window
                            var containerInnerHeight = $suggestionContainer.innerHeight(),
                                containerScrollTop = $suggestionContainer.scrollTop(),
                                suggestionHeight = $suggestionContainer.children().eq(0).outerHeight(),
                                activeSuggestionPosY = suggestionHeight * ($.formUtils._selectedSuggestion);

                            if( activeSuggestionPosY < containerScrollTop || activeSuggestionPosY > (containerScrollTop+containerInnerHeight)) {
                                $suggestionContainer.scrollTop( activeSuggestionPosY );
                            }

                            $suggestions
                                .removeClass('active-suggestion')
                                .css('background', 'none')
                                .eq($.formUtils._selectedSuggestion)
                                    .addClass('active-suggestion')
                                    .css(config.activeSuggestionCSS);

                            e.preventDefault();
                            return false;
                        }
                    }
                })
                .bind('blur', function() {
                    onSelectSuggestion($(this));
                });

            return $element;
        },

       /**
        * Error dialogs
        *
        * @var {Object}
        */
        LANG : {
            errorTitle : 'Form submission failed!',
            requiredFields : 'You have not answered all required fields',
            badTime : 'You have not given a correct time',
            badEmail : 'You have not given a correct e-mail address',
            badTelephone : 'You have not given a correct phone number',
            badSecurityAnswer : 'You have not given a correct answer to the security question',
            badDate : 'You have not given a correct date',
            lengthBadStart : 'You must give an answer between ',
            lengthBadEnd : 'characters',
            lengthTooLongStart : 'You have given an answer longer than ',
            lengthTooShortStart : 'You have given an answer shorter than ',
            notConfirmed : 'Values could not be confirmed',
            badDomain : 'Incorrect domain value',
            badUrl : 'The answer you gave was not a correct URL',
            badCustomVal : 'You gave an incorrect answer',
            badInt : 'The answer you gave was not a correct number',
            badSecurityNumber : 'Your social security number was incorrect',
            badUKVatAnswer : 'Incorrect UK VAT Number',
            badStrength : 'The password isn\'t strong enough',
            badNumberOfSelectedOptionsStart : 'You have to choose at least ',
            badNumberOfSelectedOptionsEnd : ' answers',
            badAlphaNumeric : 'The answer you gave must contain only alphanumeric characters ',
            badAlphaNumericExtra: ' and ',
            wrongFileSize : 'The file you are trying to upload is too large',
            wrongFileType : 'The file you are trying to upload is of wrong type',
            groupCheckedRangeStart : 'Please choose between ',
            groupCheckedTooFewStart : 'Please choose at least ',
            groupCheckedTooManyStart : 'Please choose a maximum of ',           
            groupCheckedEnd : ' item(s)'
        }
    };


    /* * * * * * * * * * * * * * * * * * * * * *
      CORE VALIDATORS
    * * * * * * * * * * * * * * * * * * * * */


    /*
    * Validate email
    */
    $.formUtils.addValidator({
        name : 'email',
        validatorFunction : function(email) {
            var emailFilter = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(emailFilter.test(email)) {
               var parts = email.split('@');
               if(parts.length == 2) {
                   return $.formUtils.validators.validate_domain.validatorFunction(parts[1]);
               }
            }
            return false;
        },
        errorMessage : '',
        errorMessageKey : 'badEmail'
    });

    /*
    * Validate domain name
    */
    $.formUtils.addValidator({
        name : 'domain',
        validatorFunction : function(val, $input) {

            var topDomains = ['.com', '.net', '.org', '.biz', '.coop', '.info', '.museum', '.name', '.pro',
                    '.edu', '.gov', '.int', '.mil', '.ac', '.ad', '.ae', '.af', '.ag', '.ai', '.al',
                    '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw', '.az', '.ba', '.bb',
                    '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm', '.bn', '.bo', '.br', '.bs',
                    '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc', '.cd', '.cf', '.cg', '.ch', '.ci',
                    '.ck', '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cx', '.cy', '.cz', '.de',
                    '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.eh', '.er', '.es', '.et',
                    '.fi', '.fj', '.fk', '.fm', '.fo', '.fr', '.ga', '.gd', '.ge', '.gf', '.gg', '.gh',
                    '.gi', '.gl', '.gm', '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gv', '.gy',
                    '.hk', '.hm', '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io',
                    '.iq', '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki',
                    '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li', '.lk',
                    '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.me', '.mg', '.mh',
                    '.mk', '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt', '.mu', '.mv',
                    '.mw', '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng', '.ni', '.nl', '.no',
                    '.np', '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf', '.pg', '.ph', '.pk', '.pl',
                    '.pm', '.pn', '.pr', '.ps', '.pt', '.pw', '.py', '.qa', '.re', '.ro', '.rs', '.rw',
                    '.ru', '.sa', '.sb', '.sc', '.sd', '.se', '.sg', '.sh', '.si', '.sj', '.sk', '.sl',
                    '.sm', '.sn', '.so', '.sr', '.st', '.sv', '.sy', '.sz', '.tc', '.td', '.tf', '.tg',
                    '.th', '.tj', '.tk', '.tm', '.tn', '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz',
                    '.ua', '.ug', '.uk', '.um', '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi',
                    '.vn', '.vu', '.ws', '.wf', '.ye', '.yt', '.za', '.zm', '.zw', '.mobi', '.xxx', '.asia'],

                ukTopDomains = ['co', 'me', 'ac', 'gov', 'judiciary','ltd', 'mod', 'net', 'nhs', 'nic',
                        'org', 'parliament', 'plc', 'police', 'sch', 'bl', 'british-library', 'jet','nls'],

                dot = val.lastIndexOf('.'),
                domain = val.substring(0, dot),
                ext = val.substring(dot, val.length),
                hasTopDomain = false;

            for (var i = 0; i < topDomains.length; i++) {
                if (topDomains[i] === ext) {
                    if(ext==='.uk') {
                        //Run Extra Checks for UK Domain Names
                        var domainParts = val.split('.');
                        var tld2 = domainParts[domainParts.length-2];
                        for(var j = 0; j < ukTopDomains.length; j++) {
                            if(ukTopDomains[j] === tld2) {
                                hasTopDomain = true;
                                break;
                            }
                        }

                        if(hasTopDomain)
                            break;

                    } else {
                        hasTopDomain = true;
                        break;
                    }
                }
            }

            if (!hasTopDomain) {
                return false;
            } else if (dot < 2 || dot > 57) {
                return false;
            } else {
                var firstChar = domain.substring(0, 1);
                var lastChar = domain.substring(domain.length - 1, domain.length);

                if (firstChar === '-' || firstChar === '.' || lastChar === '-' || lastChar === '.') {
                    return false;
                }
                if (domain.split('.').length > 3 || domain.split('..').length > 1) {
                    return false;
                }
                if (domain.replace(/[0-9a-z\.\-]/g, '') !== '') {
                    return false;
                }
            }

            // It's valid, lets update input with trimmed value perhaps??
            if(typeof $input !== 'undefined') {
                $input.val(val);
            }

            return true;
        },
        errorMessage : '',
        errorMessageKey: 'badDomain'
    });

    /*
    * Validate required
    */
    $.formUtils.addValidator({
        name : 'required',
        validatorFunction : function(val, $el) {
            return $el.attr('type') == 'checkbox' ? $el.is(':checked') : $.trim(val) !== '';
        },
        errorMessage : '',
        errorMessageKey: 'requiredFields'
    });

    /*
    * Validate length range
    */
    $.formUtils.addValidator({
        name : 'length',
        validatorFunction : function(value, $el, config, lang) {
            var lengthAllowed = $el.valAttr('length');
            if(lengthAllowed == undefined) {
                var elementType = $el.get(0).nodeName;
                alert('Please add attribute "data-validation-length" to '+elementType+' named '+$el.attr('name'));
                return true;
            }

            // check if length is above min, below max, within range etc.
                var lengthCheckResults = $.formUtils.numericRangeCheck(value.length, lengthAllowed),
                    checkResult;

                switch(lengthCheckResults[0] )
                {   // outside of allowed range
                    case "out":
                        this.errorMessage = lang.lengthBadStart + lengthAllowed + lang.lengthBadEnd;
                        checkResult = false;
                        break;
                    // too short
                    case "min":
                        this.errorMessage = lang.lengthTooShortStart + lengthCheckResults[1] + lang.lengthBadEnd;
                        checkResult = false;
                        break;
                    // too long
                    case "max":
                        this.errorMessage = lang.lengthTooLongStart + lengthCheckResults[1] + lang.lengthBadEnd;
                        checkResult = false;
                        break;
                    // ok
                    default:
                        checkResult = true;
                }
            
            return checkResult;
        },
        errorMessage : '',
        errorMessageKey: ''
    });

    /*
    * Validate url
    */
    $.formUtils.addValidator({
        name : 'url',
        validatorFunction : function(url) {
            // written by Scott Gonzalez: http://projects.scottsplayground.com/iri/ but added support for arrays in the url ?arg[]=sdfsdf
            var urlFilter = /^(https|http|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|\[|\]|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            if( urlFilter.test(url) ) {
                var domain = url.split('://')[1];
                var domainSlashPos = domain.indexOf('/');
                if(domainSlashPos > -1)
                    domain = domain.substr(0, domainSlashPos);

                return $.formUtils.validators.validate_domain.validatorFunction(domain); // todo: add support for IP-addresses
            }
            return false;
        },
        errorMessage : '',
        errorMessageKey: 'badUrl'
    });

    /*
    * Validate number (floating or integer)
    */
    $.formUtils.addValidator({
        name : 'number',
        validatorFunction : function(val, $el, config) {
            if(val !== '') {
                var allowing = $el.valAttr('allowing') || '',
                    decimalSeparator = $el.valAttr('decimal-separator') || config.decimalSeparator;

                if(allowing.indexOf('number') == -1)
                    allowing += ',number';

                if(allowing.indexOf('negative') > -1 && val.indexOf('-') === 0) {
                    val = val.substr(1);
                }

                if(allowing.indexOf('number') > -1 && val.replace(/[0-9]/g, '') === '') {
                    return true;
                }
                if(allowing.indexOf('float') > -1 && val.match(new RegExp('^([0-9]+)\\'+decimalSeparator+'([0-9]+)$')) !== null) {
                    return true;
                }
            }
            return false;
        },
        errorMessage : '',
        errorMessageKey: 'badInt'
    });

    /*
     * Validate alpha numeric
     */
    $.formUtils.addValidator({
        name : 'alphanumeric',
        validatorFunction : function(val, $el, config, language) {
            var patternStart = '^([a-zA-Z0-9',
                patternEnd = ']+)$',
                additionalChars = $el.attr('data-validation-allowing'),
                pattern = '';

            if( additionalChars ) {
                pattern = patternStart + additionalChars + patternEnd;
                var extra = additionalChars.replace(/\\/g, '');
                if( extra.indexOf(' ') > -1 ) {
                    extra = extra.replace(' ', '');
                    extra += ' and spaces ';
                }
                this.errorMessage = language.badAlphaNumeric + language.badAlphaNumericExtra + extra;
            } else {
                pattern = patternStart + patternEnd;
                this.errorMessage = language.badAlphaNumeric;
            }

            return new RegExp(pattern).test(val);
        },
        errorMessage : '',
        errorMessageKey: ''
    });

    /*
    * Validate against regexp
    */
    $.formUtils.addValidator({
        name : 'custom',
        validatorFunction : function(val, $el, config) {
            var regexp = new RegExp($el.valAttr('regexp'));
            return regexp.test(val);
        },
        errorMessage : '',
        errorMessageKey: 'badCustomVal'
    });

    /*
    * Validate date
    */
    $.formUtils.addValidator({
        name : 'date',
        validatorFunction : function(date, $el, conf) {
            var dateFormat = 'yyyy-mm-dd';
            if($el.valAttr('format')) {
                dateFormat = $el.valAttr('format');
            }
            else if( conf.dateFormat ) {
                dateFormat = conf.dateFormat;
            }

            return $.formUtils.parseDate(date, dateFormat) !== false;
        },
        errorMessage : '',
        errorMessageKey: 'badDate'
    });


    /*
    * Validate group of checkboxes, validate qty required is checked
    * written by Steve Wasiura : http://stevewasiura.waztech.com
    * element attrs
    *    data-validation="checkbox_group"
    *    data-validation-qty="1-2"  // min 1 max 2
    *    data-validation-error-msg="chose min 1, max of 2 checkboxes"
    */
    $.formUtils.addValidator({
        name : 'checkbox_group',
        validatorFunction : function(val, $el, config, lang, $form) 
        {   // preset return var
            var checkResult = true;
            // get name of element. since it is a checkbox group, all checkboxes will have same name
            var elname = $el.attr('name');
            // get count of checked checkboxes with this name
            var checkedCount = $("input[type=checkbox][name^='"+elname+"']:checked", $form).length;
            // get el attr that specs qty required / allowed
            var qtyAllowed = $el.valAttr('qty');
            if (qtyAllowed == undefined) {
                var elementType = $el.get(0).nodeName;
                alert('Attribute "data-validation-qty" is missing from '+elementType+' named '+$el.attr('name'));
            }
            // call Utility function to check if count is above min, below max, within range etc.
            var qtyCheckResults = $.formUtils.numericRangeCheck(checkedCount, qtyAllowed) ;
            // results will be array, [0]=result str, [1]=qty int
            switch(qtyCheckResults[0] ) {   
                // outside allowed range
                case "out":
                    this.errorMessage = lang.groupCheckedRangeStart + qtyAllowed + lang.groupCheckedEnd;
                    checkResult = false;
                    break;
                // below min qty
                case "min":
                    this.errorMessage = lang.groupCheckedTooFewStart + qtyCheckResults[1] + lang.groupCheckedEnd;
                    checkResult = false;
                    break;
                // above max qty
                case "max":
                    this.errorMessage = lang.groupCheckedTooManyStart + qtyCheckResults[1] + lang.groupCheckedEnd;
                    checkResult = false;
                    break;
                // ok
                default:
                    checkResult = true;
            }
            
        return checkResult;
        
        } // remove comma
     //   errorMessage : '', // set above in switch statement
     //   errorMessageKey: '' // not used
    });

})(jQuery);
