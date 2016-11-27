var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */

/*

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

*/

router.get('/', function(req, res) {                        //router.get(URL requested, callback function);
  var MongoClient = mongodb.MongoClient;
  
  var url = 'mongodb://localhost:27017/test';               //"test" in the URL is the name of a database
  
  MongoClient.connect(url, function(err, db) {
    if (err){
      console.log("Unable to connect to the server", err);
    } else {
      console.log("Connection established");
      
      var collection = db.collection('audios');
      collection.find({}).toArray(function(err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('index', { "audioList" : result });    // render(<filename (might be .jade file)>, <what to pass to file>)
        } else {
          res.send('No documents found');
        }
        
        db.close();
      });
    }
  });
});

router.get('/payment', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  
  var url = 'mongodb://localhost:27017/test';   
  
  MongoClient.connect(url, function(err, db) {
    if (err){
      console.log("Unable to connect to the server", err);
    } else {
      console.log("Connection established");
      
      var prodToPurchaseId = new mongodb.ObjectID(req.query.id);
      console.log(prodToPurchaseId);
      
      var collection = db.collection('audios');
      collection.find({ _id: prodToPurchaseId }).limit(1).next( function(err, result) { 
        if (err) {
          res.send(err);
        } else if (result) {
          res.render('payment', { "audioToPurchase" : result });                // if found, result is only one document
        } else {
          res.send('No documents found');
        }
        
        db.close();
      });
    }
  });
});

module.exports = router;
