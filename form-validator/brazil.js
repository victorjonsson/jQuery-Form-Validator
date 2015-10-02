/**
 *  JQUERY-FORM-VALIDATOR
 *
 *  @website by 
 *  @license MIT
 *  @version 2.2.8
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.formUtils.addValidator({name:"cpf",validatorFunction:function(a){var b=a.replace(/\D/g,""),c=0,d=0,e=0,f=0;if(11!=b.length||"00000000000"==b)return!1;for(i=1;i<=9;i++)c+=parseInt(b.substring(i-1,i))*(11-i);if(e=10*c%11,e>=10&&(e=0),e!=parseInt(b.substring(9,10)))return!1;for(i=1;i<=10;i++)d+=parseInt(b.substring(i-1,i))*(12-i);return f=10*d%11,f>=10&&(f=0),f!=parseInt(b.substring(10,11))?!1:!0},errorMessage:"",errorMessageKey:"badBrazilCPFAnswer"}),a.formUtils.addValidator({name:"brphone",validatorFunction:function(a){return a.match(/^(\+[\d]{1,3}[\s]{0,1}){0,1}(\(){0,1}(\d){2}(\)){0,1}(\s){0,1}(\d){4,5}([-. ]){0,1}(\d){4}$/g)?!0:!1},errorMessage:"",errorMessageKey:"badBrazilTelephoneAnswer"}),a.formUtils.addValidator({name:"cep",validatorFunction:function(a){return a.match(/^(\d){5}([-. ]){0,1}(\d){3}$/g)?!0:!1},errorMessage:"",errorMessageKey:"badBrazilCEPAnswer"})});