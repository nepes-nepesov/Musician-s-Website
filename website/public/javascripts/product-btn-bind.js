// Bind buttons to product

// NOTE: Buttons are actually anchor tags

function proceed() {
  var buyButtons = document.getElementsByClassName("buy-button");
  
  if (buyButtons !== null && buyButtons !== undefined) {
    for (var i = 0; i < buyButtons.length; i++) { //for every button
      buyButtons[i].addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = '/payment?id=' + e.srcElement.id; // this ID points to the ID of an entry in db
      });
    }
  }
}

window.onload = proceed();
