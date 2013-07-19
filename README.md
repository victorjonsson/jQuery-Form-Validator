# jQuery Form Validator

With this feature rich jQuery plugin it becomes easy to validate user input while keeping your
 HTML markup clean from javascript code. Even though this plugin has **a wide range of validation functions**
it's designed to require as little bandwidth as possible. This is achieved by grouping together validation functions
in "modules", making it possible for the programmer to load **only those functions that's needed** to validate a
particular form.

**Form demos and full documentations is available at http://formvalidator.net/**

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
    $.setupForm({
        modules : 'date, security'
    });
</script>
```

### Moving up to version 2.0

So what has changed since version 1.x?

 * A whole bunch of validation functions have been added (see below).
 * A modular design have been introduced, which means that some validation functions is default and others is
 part of a module. This in turn lowers server and bandwidth costs.
 * You no longer need to prefix the validation rules with "validate_".
 * Error message position now defaults to "element".
 * The optional features (validateOnBlur and showHelpOnFocus) is now enabled by default.
 * The function $.setupForm(config) is introduced to reduce the amount of code that has to be written when initiating the form validation.
 * Demos and full documentation is now available at http://formvalidator.net/

### Default validators and features (no module needed)
 * **url**
 * **email**
 * **domain** — *domain.com*
 * **number** — *float/negative/positive*
 * **date** — *yyyy-mm-dd (format can be customized, more information below)*
 * **alphanumeric** — *with support for defining additional characters*
 * **length** — *min/max/range*
 * **required** — *no validation except that a value has to be given*
 * **custom** — *Validate value against regexp*
 * Show help information automatically when input is focused
 * Validate given values immediately when input looses focus.
 * Make validation optional by adding attribute data-validation-optional="true" to the element. This means
 that the validation defined in data-validation only will take place in case a value is given.
 * Make validation dependent on another input of type checkbox being checked by adding attribute
 data-validation-if-checked="name of checkbox input"
 * Create input suggestions with ease, no jquery-ui needed

Read the documentation for the default features at [http://formvalidator.net/#default-validators](http://formvalidator.net/#default-validators)

### Module: security
 * **spamcheck**
 * **confirmation**
 * **strength** — *Validate the strength of a password (strength strength3)*
 * **backend** — *Validate value of input on server side*

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
        validate : function(value, $el, config, language, $form) {
            return parseInt(value, 10) % 2 === 0;
        },
        errorMessage : 'You have to answer an even number',
        errorMessageKey: 'badEvenNumber'
    });

    // Initiate form validation
    $.setupForm();

</script>
```

### Required properties passed into $.formUtils.addValidator

*name* - The name of the validator, which is used in the validation attribute of the input element.

*validate* - Callback function that validates the input. Should return a boolean telling if the value is considered valid or not.

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
    tooLongStart : 'You have given an answer longer than ',
    tooLongEnd : ' characters',
    tooShortStart : 'You have given an answer shorter than ',
    tooShortEnd : ' characters',
    badLength : 'You have to give an answer between ',
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
    wrongFileType : 'The file you are trying to upload is of wrong type'
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
  $.setupForm({
    language : enErrorDialogs
  });
</script>
...
```

Inline error messages is also possible. If you add attribute `data-validation-error-msg` to an element the value of
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

## Changelog

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
 * Added function $.formSetup() to reduce the amount of code that has to be written when initiating the form validation.


## Credits

#### Maintainer

[Victor Jonsson](https://github.com/victorjonsson)

#### Contributors
<a href="https://github.com/robamaton" target="_blank">Joel Sutherland</a><br />
<a href="https://github.com/stevewasiura" target="_blank">Steve Wasiura</a><br />
<a href="https://github.com/mattclements" target="_blank">Matt Clements</a><br />
<a href="https://github.com/dfcplc" target="_blank">@dfcplc</a><br />
<a href="https://github.com/coffein" target="_blank">Andree Wendel</a><br />
<a href="http://www.huotmedia.com" target="_blank">Nicholas Huot</a><br />
<a href="https://github.com/Repkit" target="_blank">@repkit</a><br />
<a href="https://github.com/aL3xa" target="_blank">Alexandar Blagotic</a><br />
<a href="http://thekindof.me/" target="_blank">Yasith Fernando</a><br />
<a href="https://github.com/S0L4R1S" target="_blank">@S0L4R1S</a><br />

#### Additional credits

<a href="http://projects.scottsplayground.com/iri/" target="_blank">Scott Gonzales</a> (URL regexp)<br />
<a href="http://www.mypocket-technologies.com" target="_blank">Darren Mason</a> (Password strength meter)
