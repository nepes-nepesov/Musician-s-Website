//Get product requested to purchase

function getURLParameter(name, url) { // "name" is the parameter name
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var currentURL = window.location.href;
var passedParam = getURLParameter("id", currentURL); // product ID

console.log(passedParam);

/*
  There are three steps for registering token:
  Step 1. Collecting credit card information with Stripe.js
  Step 2. Converting those payment details to a single-use token
  Step 3. Submitting that token, with the rest of your form, to your server
*/
/*
  Step 1: Collecting credit card information
*/
// Step 1 is done in payment.html
/*
  Step 2: Create a single use token
*/
/*
  Create an event handler that handles the submit event on the form. 
  The handler should send the form data to Stripe for tokenization and prevent the form's submission. 
  (The form will be submitted by JavaScript later.)
*/

Stripe.setPublishableKey('pk_test_rc9YXvtg5HuFinuDJukp1HeR');
$(function () {
  var $form = $('#payment-form');
  $form.submit(function (event) {
    // Disable the submit button to prevent repeated clicks:
    $form.find('.submit').prop('disabled', true);
    // Request a token from Stripe:
    Stripe.card.createToken($form, stripeResponseHandler);
    // Prevent the form from being submitted:
    return false;
  });
});


/*
  Step 3: Sending the form to your server
*/

function stripeResponseHandler(status, response) {
  // Grab the form:
  var $form = $('#payment-form');
  if (response.error) { // Problem!
    // Show the errors on the form:
    $form.find('.payment-errors').text(response.error.message);
    $form.find('.submit').prop('disabled', false); // Re-enable submission
  }
  else { // Token was created!
    // Get the token ID:
    var token = response.id;
    console.log(token); //debug
    // Insert the token ID into the form so it gets submitted to the server:
    //$form.append($('<input type="hidden" name="stripeToken">').val(token));
    $form.append("<input type='hidden' name='stripeToken' value='" + response.id + "'/>");
    $form.append("<input type='hidden' name='productId' value='" + passedParam + "'/>");
    
    // Submit the form:
    $form.get(0).submit();
  }
};
