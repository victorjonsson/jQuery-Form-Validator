# jQuery Form Validator

jQuery Form Validator is a **feature rich and multilingual** jQuery plugin that makes it easy to validate user input while keeping your HTML markup clean from javascript code. Even though this plugin has a wide range of validation functions it's **designed to require as little network traffic as possible**. This is achieved by grouping together validation functions in "modules", making it possible to load only those functions that's needed to validate a particular form.

**Form demos and full documentation available at http://formvalidator.net/**

[![Travis](https://travis-ci.org/victorjonsson/PHP-Markdown-Documentation-Generator.svg)](https://travis-ci.org/victorjonsson/jQuery-Form-Validator/builds/)

[![npm version](https://badge.fury.io/js/jquery-form-validator.svg)](https://www.npmjs.com/package/jquery-form-validator)

*Usage example*

```html
<form action="" method="POST">
  <p>
    Name (4 characters minimum):
    <input name="user" data-validation="length" data-validation-length="min4" />
  </p>
  <p>
    Birthdate (yyyy-mm-dd):
    <input name="birth" data-validation="birthdate" />
  </p>
  <p>
    Website:
    <input name="website" data-validation="url" />
  </p>
  <p>
    <input type="submit" />
  </p>
</form>
<script src="js/jquery.min.js"></script>
<script src="js/form-validator/jquery.form-validator.min.js"></script>
<script>
    $.validate({
        modules : 'date, security'
    });
</script>
```

### Support for HTML5

This plugin can serve as a fallback solution for the validation attributes in the HTML5 spec. With the [html5](http://www.formvalidator.net/#configuration_html5) module you can use the following native features:

**Attributes**: require, pattern, maxlength, min, max, placeholder

**Input types**: url, date, time, email, number

**Elements**: Use the element `datalist` to create input suggestions


### Default validators and features (no module needed)
 * **url**
 * **email**
 * **domain** — *domain.com*
 * **number** — *float/negative/positive/range/step*
 * **date** — *yyyy-mm-dd (format can be customized, more information below)*
 * **alphanumeric** — *with support for defining additional characters*
 * **length** — *min/max/range*
 * **required** — *no validation except that a value has to be given*
 * **custom** — *Validate value against regexp*
 * **checkboxgroup** — *ensure at least 1 checkbox in group has been selected*
 * Show help information automatically when input is focused
 * Validate given values immediately when input looses focus.
 * Make validation optional by adding attribute data-validation-optional="true" to the element. This means
 that the validation defined in data-validation only will take place in case a value is given.
 * Make validation dependent on another input of type checkbox being checked by adding attribute
 data-validation-if-checked="name of checkbox input"
 * Create input suggestions with ease, no jquery-ui needed
 * to apply multiple validators to an input element, separate the validator names using a space (ex: required email)

Read the documentation for the default features at [http://formvalidator.net/#default-validators](http://formvalidator.net/#default-validators)

### Module: security
 * **spamcheck**
 * **confirmation**
 * **creditcard**
 * **CVV**
 * **strength** — *Validate the strength of a password*
 * **server** — *Validate value of input on server side*
 * **letternumeric** — *Validate that the input value consists out of only letters and/or numbers*
 * **recaptcha** - *Validate Google [reCaptcha 2](https://www.google.com/recaptcha/intro/index.html)* 

Read the documentation for the security module at [http://formvalidator.net/#security-validators](http://formvalidator.net/#security-validators)

### Module: date
 * **time** — *hh:mm*
 * **birthdate** — *yyyy-mm-dd, not allowing dates in the future or dates that's older than 122 years (format can be customized, more information below)*

Read the documentation for the date module at [http://formvalidator.net/#date-validators](http://formvalidator.net/#date-validators)

### Module: location
 * **country**
 * **federatestate**
 * **longlat**
 * Suggest countries (english only)
 * Suggest states in the US

Read the documentation for the location module at [http://formvalidator.net/#location-validators](http://formvalidator.net/#location-validators)

### Module: file
 * **mime**
 * **extension**
 * **size** (file size)
 * **dimension** (size dimension and ratio)

Read the documentation for the file module at [http://formvalidator.net/#file-validators](http://formvalidator.net/#file-validators)

### Module: logic

* **Dependent validation**
* **Require "one-of"**

Read the documentation for this module at [http://formvalidator.net/#logic](http://www.formvalidator.net/#logic)

### Module: sepa

* **IBAN**
* **BIC**
* **Sepa**

Read the documentation for this module at [http://formvalidator.net/#sepa](http://www.formvalidator.net/#sepa)


### Module: sweden
 * **swemob** — *validate that the value is a swedish mobile telephone number*
 * **swesec** — *validate swedish social security number*
 * **county** - *validate that the value is an existing county in Sweden*
 * **municipality** - *validate that the value is an existing municipality in Sweden*
 * Suggest county
 * Suggest municipality

Read the documentation for the Swedish module at [http://formvalidator.net/#sweden-validators](http://www.formvalidator.net/#country-specific-validators_sweden)

### Module: uk
 * **ukvatnumber**
 * **uknin** 
 * **ukutr** 

Read the documentation for the UK module at [http://formvalidator.net/#uk-validators](http://www.formvalidator.net/#country-specific-validators_uk)

### Module: brazil
 * **brphone** — *Validate a brazilian telephone number*
 * **cep**
 * **cpf**

### Module: poland 
 * **plpesel** - *validate polish personal identity number (in Polish identity cards)*
 * **plnip** - *validate polish VAT identification number*
 * **plregon** - *validate polish bussiness identity number*

### Module: sanitation
 * **trim**
 * **trimLeft**
 * **trimRight**
 * **upper**  — Convert all letters to upper case
 * **lower**  — Convert all letters to lower case
 * **capitalize**  — Convert the first letter in all words to upper case
 * **insertRight**  — Declare a text that should be inserted at the end of the value, attribute data-sanitize-insert-right
 * **insertLeft**  — Declare a text that should be inserted at the beginning of the value, attribute data-sanitize-insert-left
 * **escape**  — Convert < > & ' " to html entities
 * **strip**  — Comma separated list with words that gets automatically removed
 * **numberFormat**  — Declare the attribute data-sanitize-number-format with any of the formats described on http://numeraljs.com/. Note that this rule requires that numeral.js is included in the page

Read the documentation for the sanitation module at [http://formvalidator.net/#data-sanitation](http://formvalidator.net/#data-sanitation)


## Writing a custom validator
You can use the function `$.formUtils.addValidator()` to add your own validation function. Here's an example of a validator
that checks if the input contains an even number.

```html
<form action="" method="POST">
    <p>
        <input type="text" data-validation="even" />
    </p>
    ...
</form>
<script src="js/jquery.min.js"></script>
<script src="js/form-validator/jquery.form-validator.min.js"></script>
<script>

    // Add validator
    $.formUtils.addValidator({
        name : 'even',
        validatorFunction : function(value, $el, config, language, $form) {
            return parseInt(value, 10) % 2 === 0;
        },
        errorMessage : 'You have to answer an even number',
        errorMessageKey: 'badEvenNumber'
    });

    // Initiate form validation
    $.validate();

</script>
```

### Required properties passed into $.formUtils.addValidator

*name* - The name of the validator, which is used in the validation attribute of the input element.

*validatorFunction* - Callback function that validates the input. Should return a boolean telling if the value is considered valid or not.

*errorMessageKey* - Name of language property that is used in case the value of the input is invalid.

*errorMessage* - An alternative error message that is used if errorMessageKey is left with an empty value or isn't defined
in the language object. Note that you also can use [inline error messages](http://formvalidator.net/#localization) in your form.


The validation function takes these five arguments:
- value — the value of the input thats being validated
- $el — jQuery object referring to the input element being validated
- config — Object containing the configuration of this form validation
- language — Object with error dialogs
- $form — jQuery object referring to the form element being validated

## Creating a custom module

A "module" is basically a javascript file containing one or more calls to [$.formUtils.addValidator()](#writing-a-custom-validator).
The module file must be placed in the same directory as `jquery.form-validator.min.js` if you want it to load automatically via the setup function.

You can use the method `$.formUtils.loadModules` if you want to load the module from a custom path.

```js
$.formUtils.loadModules('customModule otherCustomModule', 'js/validation-modules/');
$.validate({
   modules: 'security, date'
});
```

The first argument of `$.formUtils.loadModules` is a comma separated string with names of module files, without
file extension.

The second argument is the path where the module files are located. This argument is optional, if not given
the module files has to be located in the same directory as the core modules shipped together with this jquery plugin
(js/form-validator/)

## Show help information
It is possible to display help information for each input. The information will fade in when input is focused and fade out when input looses focus.

```html
<form action="" id="my_form">
	<p>
	  <strong>Why not:</strong>
	  <textarea name="why" data-validation-help="Please give us some more information" data-validation="required"></textarea>
	</p>
	...
```

## Fully customizable

Read about how to customize this plugin over at [http://formvalidator.net/#configuration](http://formvalidator.net/#configuration)

### Validate On Event ###
You can cause an element to be validated upon the firing of an event, by attaching an attribute to the form input element named `data-validation-event="click"`. When the configuration settings have `validateOnEvent : true`, the click event will trigger the onBlur validaton for that element. Possible use case: Checkboxes. Instead of waiting for the checkbox to lose focus (blur) and waiting for a validation to occurr, you can specify that elements validation should occur as soon as that checkbox element is clicked.

## Localization

This plugin comes with translations for English, Polish,
  Romanian,
  Danish,
  Norwegian,
  Dutch,
  Czech,
  Catalan,
  Russian,
  Italian,
  French,
  German,
  Swedish and
  Portuguese. You can also choose to override the error
dialogs yourself. Here you can read more about [localization](http://formvalidator.net/#localization)

## Changelog

#### 2.3.19
- New translations (Polish, Romanian, Danish, Norwegian, Dutch, Czech, Russian, Italian)
- Several improvements made to already existing translations
- "Validation help" no longer puts constraints on input names
- Improved confirmation validation
- Config parameter `errorMessagePosition` is now only used to point out where error message should be placed. New configuration parameters is introduced that handles custom positioning of error messages [#226](https://github.com/victorjonsson/jQuery-Form-Validator/issues/226#issuecomment-191233456)
- Now possible to add `data-validation-ignore` to filter out certain characters before validation
- New sanitation method `strip` that removes defined characters
- Now possible to declare attributes not prefixed with data-validation in jsconf module
- All inputs gets sanitized on page load when using sanitation module
- Allow dates to omit leading zero using `data-validation-require-leading-zero="false"`
- Module toggleDisabled now acts on value change, not only mouse click
- `data-validation-if-checked` now deprecated, use `data-validation-depends-on` instead [#153](https://github.com/victorjonsson/jQuery-Form-Validator/issues/153)
- Event `beforeValidation` now gets value, language and configuration as arguments and can be used to prevent validation of the input.
- Security module now has a `recaptcha` validator that uses Google reCaptcha 2
- The plugin is installable using npm (also possible to require validation modules when using browserify)
- Polish validation module
- Brazilian validation module
- UK validation module now also have validators `uknin` `ukutr`
- Sepa-module that makes it possible to validate sepa, iban and bic.
- New module named "logic" containing the features `data-validation-depends-on` and `data-validation-optional-if-answered`

#### 2.2.8
- The plugin is now again possible to install via bower.
- Portoguese language pack and validators
- New module used for data-sanitiation
- E-mail addresses now validated in accordance to rfc 6531
- Now possible to use $.fn.validate to programmatically validate inputs
- Hidden inputs won't get validated by default (can be overriden using option validateHiddenInputs)


#### 2.2.43
- Fixed min/max parse error in HTML5 module
- Now also supports Twitter bootstraps horizontal forms
- This plugin now also distributes a default CSS theme including success/fail icons (used on formvalidator.net)
- Email validation now won't fail if email begins with a number
- This plugin now comes with error dialogs translated to English, French, German, Spanish and English.
- New validator `letternumeric`. Validates that input consists out of any type of letter (not only alphanumeric) and/or numbers
- You can now validate image dimension and ratio
- ... and a bunch of other smaller bug fixes and improvements.

#### 2.2.0
* Now possible to define an error message for each validation rule on a certain input (issue #113)
* This plugin now serves as a html5 fallback. You can now use the native attributes to declare which type
of validation that should be applied.
* Use a template for error messages when having errorMessagePosition set to top
* Added validation of credit card number and CVV to the security module
* Event onElementValidate added
* Use the attribute data-validation-confirm to declare which input that should be confirmed when using validation=confirmation (issue #112)
* Validation "required" now supports inputs of type radio
* $.validateForm is now deprecated, use $.isValid instead
* Possible to check if form is valid programmatically without showing error messages
* Select elements can now be validated server-side
* Cleaned up dialog messages
* Various IE8 fixes
* Possible to send along parameters to the server when using server side validation
* Now possible to set your own parameter name when using server side validation
* Improved/simplified URL validation
* ... and a whole lot more small improvements

#### 2.1.47
* Incorrect error-styling when using datepicker or suggestions is now fixed
* Incorrect error-styling of select elements is now fixed
* Deprecated function $.validationSetup is now removed, use $.validate() instead
* You can now return an array with errors using the event `onValidate`
* You can now declare an element where all error messages should be placed (config.errorMessagePosition)

#### 2.1.36
* Now possible to use the native reset() function to clear error messages and error styling of the input elements

#### 2.1.34
* General improvements and bug fixes
* Added events "beforeValidation" and "validation" (see http://formvalidator.net/#configuration_callbacks for more info)

#### 2.1.27
 * E-mail validation support .eu top domain
 * Improvements in server validation
 * Now possible to re-initiate the validation. This makes it possible to dynamically change the form and then call $.validate() again to refresh the validation (issue #59)
 * Number validation now supports range

#### 2.1.15
 * E-mail addresses can now contain + symbol
 * Correction of the US states in validation "federatestate"
 * Fixed bug in server validation

#### 2.1.09
 * File validation now support multiple files
 * Length validation can now be used to validate the number of uploaded files using a file input that supports multiple files
 * Validation classes is no longer applied on inputs that for some reason shouldn't become validated

#### 2.1.08
 * Now possible to configure the decimal separator when validating float values. Use either the
 attribute *data-validation-decimal-separator* or the property *decimalSeparator* when
calling $.validate()
 * $.validationSetup is renamed to $.validate. You will still be able to initiate the validation by calling
 the $.validationSetup but it's considered deprecated.

#### 2.1.06
 * Modules can now be loaded from remote websites

#### 2.1.05
 * Fixed language bug (issue #43 on github)
 * Validation on server side is now triggered by the blur event
 * Now using class names that's compliant with twitter bootstrap 3.x

#### 2.1
 * Code refactoring and some functions renamed
 * Validator "checkbox_group" added

#### 2.0.7
 * Now possible to validate file size, extension and mime type (using the file module)

#### 2.0
 * [min|max]_length is removed (now merged with length validation).
 * The number, int and float validation is merged together, all three variants is now validated by the number validation.
 * Phone validation is moved to "sweden" module and renamed to swephone.
 * The attribute to be used when defining the regular expression for custom validations is now moved to its own attribute (data-validation-regexp)
 * Length validation now looks at attribute data-validation-length (eg. min5, max200, 3-12).
 * The validation rule no longer needs to be prefixed with "validate_" (it's still possible to use the prefix but it's considered deprecated).
 * Some validation functions is moved to modules (see the function reference over at http://formvalidator.net).
 * Added function $.validationSetup() to reduce the amount of code that has to be written when initiating the form validation.


## Credits

http://www.formvalidator.net/#credits
