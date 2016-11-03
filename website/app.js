var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var routes = require('./routes/index');
var users = require('./routes/users');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_U4s9fx7HJlkiErqNn6nzEjZW"); // my test private key

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/welcome', function (req, res) {
  res.render('welcome.jade', { title: 'Welcome' });
});

/*

app.get('/payment', function (req, res) {
  res.render('payment.jade', { title: 'Payment' });
});

*/

app.get('/after-charge', function (req, res) {
  res.render('after-charge.jade', { title: 'Charge' });
});

app.post('/after-charge', function(req, res) {
  
  // Create a charge: this will charge the user's card
  var charge = stripe.charges.create({
    amount: 1000, // Amount in cents
    currency: "usd",
    source: req.body.stripeToken,
    description: req.body.productId
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      console.log("The card has been declined");
      res.render('error', {
      message: err.message,
      error: err
    });
    } else if (err) {
      console.log("Error during charge");
    } else {
      console.log("Charge created without errors");
      console.log("Purchased Product | ID: " + charge.description);
      
      //let user download the purchased product, i.e. audio file
      //use charge.description as id for product
      
      // Test //
      var MongoClient = mongo.MongoClient;
  
      var url = 'mongodb://localhost:27017/test';   
      
      MongoClient.connect(url, function(err, db) {
        if (err){
          console.log("Unable to connect to the server", err);
        } else {
          console.log("Connection established");
          
          
          var prodToPurchaseId = new mongo.ObjectID(charge.description);
          console.log(prodToPurchaseId);
          
          var collection = db.collection('audios');
          collection.find({ _id: prodToPurchaseId }).limit(1).next( function(err, result) { 
            if (err) {                                                              //!!! there is a bug here
              res.send(err);
            } else if (result) {
          
              // TODO: give user download the product file which is described by <result>
              console.log(result);
            } else {
              res.send('No documents found');
            }
            
            db.close();
          });
        }
      });
      
      // ---- //
    }
  });
  
  res.redirect('/after-charge'); // MUST use either res.end() or res.redirect(...)
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;