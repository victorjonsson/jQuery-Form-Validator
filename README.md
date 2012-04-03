This plugin was created to minimize javascript logic in the html code when dealing with front-end validation of form data. 

[Live example can be viewed here](http://victorjonsson.se/jquery-form-validator)

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
 * **validate_swesec** - *validate swedish social security number*
 * **required** — *no validation except that a value has to be given*
 * **validate_custom** - *Validate value against regexp (validate_custom regexp/^[a-z]{2} [0-9]{2}$/)

 * Show help information automatically when input is focused
 * Validate given values immediately when input is blurred.


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
	  <textarea name="why" data-help="Please give us some more information" data-validation="required"></textarea>
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
	scrollToTopOnError : false
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