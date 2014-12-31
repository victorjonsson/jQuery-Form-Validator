# jQuery Form Validator

With this feature rich jQuery plugin it becomes easy to validate user input while keeping your
 HTML markup clean from javascript code. Even though this plugin has **a wide range of validation functions**
it's designed to require as little bandwidth as possible. This is achieved by grouping together validation functions
in "modules", making it possible for the programmer to load **only those functions that's needed** to validate a
particular form.

**Form demos and full documentation is available at http://formvalidator.net/**

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
/* important to locate this script AFTER the closing form element, so form object is loaded in DOM before setup is called */
    $.validate({
        modules : 'date, security'
    });
</script>
```

### Support for HTML5

As of version 2.2 (unreleased) you can use this plugin as a fallback solution for the validation attributes in the HTML5 spec. Add the module `html5` to the module declaration and you can use the following native features:

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
 * **size**

Read the documentation for the file module at [http://formvalidator.net/#file-validators](http://formvalidator.net/#file-validators)

### Module: sweden
 * **swemob** — *validate that the value is a swedish mobile telephone number*
 * **swesec** — *validate swedish social security number*
 * **county** - *validate that the value is an existing county in Sweden*
 * **municipality** - *validate that the value is an existing municipality in Sweden*
 * Suggest county
 * Suggest municipality

Read the documentation for the Swedish module at [http://formvalidator.net/#sweden-validators](http://formvalidator.net/#sweden-validators)

### Module: uk
 * **ukvatnumber**

Read the documentation for the UK module at [http://formvalidator.net/#uk-validators](http://formvalidator.net/#uk-validators)


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

A "module" is basically a javascript file containing one or more calls to [$.formUtils.addValidator()](#writing-a-custom-validator). The module file
should either have the file extension *.js* (as an ordinary javascript file) or *.dev.js*.

Using the file extension **.dev.js** will tell *$.formUtils.loadModules* to always append a timestamp to the end of the
URL, so that the browser never caches the file. You should of course never use *.dev.js* on a production website.

### Loading your module ###

```html
<html>
<head>
    <script src="js/form-validator/jquery.form-validator.min.js"></script>
    <script>
        $.formUtils.loadModules('mymodule.dev', 'js/validation-modules/');
    </script>
</head>
</html>
...
```

The first argument of $.formUtils.loadModules is a comma separated string with names of module files, without
file extension (add .dev if the file name is for example mymodule.dev.js, this will insure that the browser never
caches the javascript).

The second argument is the path where the module files is located. This argument is optional, if not given
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
This plugin contains a set of error dialogs. In case you don't define an inline error message the plugin
will fall back on one of the dialogs below. You can how ever add the attribute *data-validation-error-msg* to an
element, and that message will be displayed instead. All error dialogs can be overwritten by passing an
object into the validation function.

```javascript
var enErrorDialogs = {
    errorTitle : 'Form submission failed!',
    requiredFields : 'You have not answered all required fields',
    badTime : 'You have not given a correct time',
    badEmail : 'You have not given a correct e-mail address',
    badTelephone : 'You have not given a correct phone number',
    badSecurityAnswer : 'You have not given a correct answer to the security question',
    badDate : 'You have not given a correct date',
    lengthBadStart : 'The input value must be between ',
    lengthBadEnd : ' characters',
    lengthTooLongStart : 'The input value is longer than ',
    lengthTooShortStart : 'The input value is shorter than ',
    notConfirmed : 'Input values could not be confirmed',
    badDomain : 'Incorrect domain value',
    badUrl : 'The input value is not a correct URL',
    badCustomVal : 'The input value is incorrect',
    badInt : 'The input value was not a correct number',
    badSecurityNumber : 'Your social security number was incorrect',
    badUKVatAnswer : 'Incorrect UK VAT Number',
    badStrength : 'The password isn\'t strong enough',
    badNumberOfSelectedOptionsStart : 'You have to choose at least ',
    badNumberOfSelectedOptionsEnd : ' answers',
    badAlphaNumeric : 'The input value can only contain alphanumeric characters ',
    badAlphaNumericExtra: ' and ',
    wrongFileSize : 'The file you are trying to upload is too large (max %s)',
    wrongFileType : 'Only files of type %s is allowed',
    groupCheckedRangeStart : 'Please choose between ',
    groupCheckedTooFewStart : 'Please choose at least ',
    groupCheckedTooManyStart : 'Please choose a maximum of ',
    groupCheckedEnd : ' item(s)',
    badCreditCard : 'The credit card number is not correct',
    badCVV : 'The CVV number was not correct'
};
```

```html
<form action="script.php">
    ...
</form>
<script src="js/jquery.min.js"></script>
<script src="js/form-validator/jquery.form-validator.min.js"></script>
<script src="js/form-validator/locale.en.js"></script>
<script>
  $.validate({
    language : enErrorDialogs
  });
</script>
...
```

It's also possible to add inline error messages. If you add attribute `data-validation-error-msg` to an element the value of
that attribute will be displayed instead of the error dialog that the validation function refers to.

## Input length restriction
```html
<p>
  History (<span id="maxlength">50</span> characters left)
  <textarea rows="3" id="area"></textarea>
</p>
<script type="text/javascript">
  $('#area').restrictLength( $('#maxlength') );
</script>
```

## Program Flow
Form submit() event is bound to jQ func **validateForm()** when the form is submitted, it calls
jQ func **$.formUtils.validateInput**, which calls **validatorFunction** for the specific validation
rule assigned to the input element. If a validation fails, error messages are assigned and displayed
as configured. If **validateOnBlur** is set to true, jQ finds all form input elements with the
data-validation attribute and binds their onBlur event to call the function **validateInputOnBlur**.
it calls jQ func **$.formUtils.validateInput** to validate the single input when blurred.


## Changelog

#### 2.2.0 (unreleased)
* Now possible to define an error message for each validation rule on a certain input (issue #113)
* This plugin now serves as a html5 fallback. You can now use the native attributes to declare which type
of validation that should be applied.
* Use a template for error messages when having errorMessagePosition set to top
* Added validation of credit card number and CVV to the security module
* Event onElementValidate added
* Use the attribute data-validation-confirm to declare which input that should be confirmed when using validation=confirmation (issue #112)
* Validation "required" now supports inputs of type radio
* $.validateForm is now deprecated, use $.isValid instead


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

#### 2.1.9
 * File validation now support multiple files
 * Length validation can now be used to validate the number of uploaded files using a file input that supports multiple files
 * Validation classes is no longer applied on inputs that for some reason shouldn't become validated

#### 2.1.8
 * Now possible to configure the decimal separator when validating float values. Use either the
 attribute *data-validation-decimal-separator* or the property *decimalSeparator* when
calling $.validate()
 * $.validationSetup is renamed to $.validate. You will still be able to initiate the validation by calling
 the $.validationSetup but it's considered deprecated.

#### 2.1.6
 * Modules can now be loaded from remote website

#### 2.1.5
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

#### Maintainer

[Victor Jonsson](https://github.com/victorjonsson)

#### Contributors
<a href="http://stevewasiura.waztech.com" target="_blank">Steve Wasiura</a><br />
<a href="http://lagden.github.com" target="_blank">Thiago Lagden</a><br />
<a href="https://github.com/robamaton" target="_blank">Joel Sutherland</a><br />
<a href="https://github.com/mattclements" target="_blank">Matt Clements</a><br />
<a href="http://www.joshtoft.com/" target="_blank">Josh Toft</a><br/>
<a href="https://github.com/dfcplc" target="_blank">@dfcplc</a><br />
<a href="https://github.com/coffein" target="_blank">Andree Wendel</a><br />
<a href="http://www.huotmedia.com" target="_blank">Nicholas Huot</a><br />
<a href="https://github.com/Repkit" target="_blank">@repkit</a><br />
<a href="https://github.com/aL3xa" target="_blank">Alexandar Blagotic</a><br />
<a href="http://thekindof.me/" target="_blank">Yasith Fernando</a><br />
<a href="https://github.com/S0L4R1S" target="_blank">@S0L4R1S</a><br />
<a href="http://lisangan.com/">Erick Lisangan</a><br />
<a href="https://github.com/kirbs-">@kirbs</a>
<a href="https://github.com/hslee87">hslee87</a>

#### Additional credits

<a href="http://projects.scottsplayground.com/iri/" target="_blank">Scott Gonzales</a> (URL regexp)<br />
<a href="http://www.mypocket-technologies.com" target="_blank">Darren Mason</a> (Password strength meter)<br />
<a href="http://stevewasiura.waztech.com" target="_blank">Steve Wasiura</a> (Checkbox group)
