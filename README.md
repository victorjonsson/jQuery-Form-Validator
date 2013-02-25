This plugin was created to minimize javascript logic in the html code when dealing with front-end validation of form data. 

[Live example can be viewed here](http://victorjonsson.se/jquery-form-validator/?from=github)

*Usage example*

```html
<form action="" onsubmit="return $(this).validate()">
  <p>
    Name (4 characters minimum):
    <input name="user" data-validation="validate_min_length length4" />
  </p>
  <p>
    Birthdate (yyyy-mm-dd): 
    <input name="birth" data-validation="validate_birthdate" />
  </p>
  <p>
    Website: 
    <input name="website" data-validation="validate_url" />
  </p>
  <p>
    <input type="submit" />
  </p>
   </form>
```

## Features
 * **validate_url**
 * **validate_date** — *yyyy-mm-dd (format can be customized, more information below)*
 * **validate_birthdate** — *yyyy-mm-dd, not allowing dates in the future or dates that is older then 122 years (format can be customized, more information below)*
 * **validate_email**
 * **validate_time** — *hh:mm*
 * **validate_domain** — *domain.com*
 * **validate_phone** — *atleast 7 digits only one hyphen and plus allowed*
 * **validate_swemob** — *validate that the value is a swedish mobile telephone number*
 * **validate_float**
 * **validate_int**
 * **validate_length** — *Validate that input length is in given range (length3-20)*
 * **validate_confirmation**
 * **validate_spamcheck**
 * **validate_ukvatnumber**
 * **validate_swesec** — *validate swedish social security number*
 * **required** — *no validation except that a value has to be given*
 * **validate_custom** — *Validate value against regexp (validate_custom regexp/^[a-z]{2} [0-9]{2}$/)
 * **validate_num_answers** — *Validate that a select element has the required number of selected options (validate_num_answers num5)*

 * Show help information automatically when input is focused
 * Validate given values immediately when input is blurred.
 * Make validation optional by adding attribute data-validation-optional="true" to the element. This means that the validation defined in data-validation only will take place in case a value is given.
 * Make validation dependent on another input of type checkbox being checked by adding attribute data-validation-if-checked="name of checkbox input"


## Validate inputs on blur
It is now possible to show that the value of an input is incorrect immediately when the input gets blurred.

```html
<form action="" onsubmit="return $(this).validate();" id="my_form">
  <p>
	  <strong>Website:</strong>
	  <input type="text" name="website" data-validation="validate_url" />
	</p>
	...
</form>

<script>
	$('#my_form').validateOnBlur();
</script>
```

## Show help information
Since version 1.1 it is possible to display help information for each input. The information will fade in when input is focused and fade out when input is blurred.

```html
<form action="" onsubmit="return $(this).validate();" id="my_form">
	<p>
	  <strong>Why not:</strong>
	  <textarea name="why" data-validation-help="Please give us some more information" data-validation="required"></textarea>
	</p>
	...
</form>

<script>
	$('#my_form').showHelpOnFocus();
</script>
```

## Fully customizable 
```javascript
var myConf = {
	// Name of element attribute holding the validation rules (default is data-validation)
	validationRuleAttribute : 'class',

	// Names of inputs not to be validated even though the element attribute containing 
	// the validation rules tells us to
	ignore : ['som-name', 'other-name'],

	// Class that will be put on elements which value is invalid (default is 'error')
	errorElementClass : 'error', 

	// Border color of elements which value is invalid, empty string to leave border 
	// color as it is
	borderColorOnError : '#FFF', 

	// Class of div container showing error messages (defualt is 'error_message')
	errorMessageClass : 'error_message',

	// Position of error messages. Set the value to "top" if you want the error messages 
	// to be displayed in the top of the form. Otherwise you can set the value to
	// "element", each error message will then be displayed beside the input field that
	// it is refering to (default is 'top')
	errorMessagePosition : 'element',

	// Date format used when validating dates and birthdate. (default is yyyy-mm-dd)
	dateFormat : 'dd/mm/yyyy',

	// Window automatically scrolls to the top of the form when submitted data is 
	// invalid (default is true)
	scrollToTopOnError : false,

	// Name of the element attribute containing the error message that will be
	// displayed instead of the error dialog that the validation function
	// referrs to (default is data-validation-error-msg)
	validationErrorMsgAttribute : 'data-error'
};

var myLang = {
	errorTitle : 'Något gick fel', 
	requiredFields : 'Du fyllde inte i alla fält markerade med *'
};

$('#my_form')
  .showHelpOnFocus()
  .validateOnBlur(myLang, myConf)
  .submit(function() {
    return $(this).validate(myLang, myConf);
  });
```

## Localization
All error dialogs can be overwritten by passing an object into the validation function.

```javascript
var jQueryFormLang = {
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
    badUrl : 'Incorrect url value',
    badFloat : 'Incorrect float value',
    badCustomVal : 'You gave an incorrect answer',
    badInt : 'Incorrect integer value',
    badSecurityNumber : 'Your social security number was incorrect',
    badUKVatAnswer : 'Incorrect UK VAT Number',
    badNumberOfSelectedOptionsStart : 'You have to choose at least ',
    badNumberOfSelectedOptionsEnd : ' answers'
};
```

```html
<html>
<head>
    <script src="scripts/jquery.formvalidator.min.js"></script>
    <script src="scripts/locale.en.js"></script>
    ...
<head>
<body>
    ...
    <form action="script.php" onsubmit="return $(this).validate(jQueryFormLang);">
    ...
```

Inline error messages is also possible. If you add attribute data-validation-error-msg to an element the value of that attribute will be displayed instead of the error dialog that the validation function referrs to.

## Simple captcha example
```php
<?php
session_start();
if( isset($_POST['captcha']) && isset($_SESSION['captcha'])) {
  if($_POST['captcha'] != ($_SESSION['captcha'][0]+$_SESSION['captcha'][1]))
    die('Invalid captcha answer');  // client does not have javascript enabled
}

$_SESSION['captcha'] = array( mt_rand(0,9), mt_rand(1, 9) );

?>
<html>
....
<form action="" onsubmit="return $(this).validate();">
  <p>
    What is the sum of <?=$_SESSION['captcha'][0]?> + <?=$_SESSION['captcha'][1]?>? (security question)
    <input name="captcha" data-validation="validate_spamcheck captcha<?=( $_SESSION['capthca'][0] + $_SESSION['captcha'][1] )?>"
  </p>
  <p><input type="submit" /></p>
</form>
...
</html>
```

## Input length restriction
```html
<p>
  History (<span id="maxlength">50</span> characters left)
  <textarea rows="3" id="area"></textarea>
</p>
<script type="text/javascript">
  $('#area').restrictLength($('#maxlength'));
</script>
```

## Password confirmation example
```html
  <p>Password: <input type="password" name="pass" data-validation="validate_confirmation" /></p>
  <p>Confirm password: <input type="password" name="pass_confirmation" /></p>
```

## Credits
[Victor Jonsson](https://github.com/victorjonsson)<br />
[Joel Sutherland](https://github.com/robamaton) (contributor)<br />
[Steve Wasiura](https://github.com/stevewasiura) (contributor)<br />
[Matt Clements](https://github.com/mattclements) (contributor)<br />
[dfcplc](https://github.com/dfcplc) (contributor)<br />
[Scott Gonzales](http://projects.scottsplayground.com/iri/) (URL regexp)
