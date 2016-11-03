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

window.onload = function() {
  /*
  //send passedParam to Node
  
  var form = document.getElementById("payment-form");
  // display prod info here
  */
  var labels = document.getElementsByTagName("label");
  labels[0].id = passedParam; //set ID to label
}

