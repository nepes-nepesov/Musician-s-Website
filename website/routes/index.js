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
      collection.find({}).toArray(function(err, result) {   //TODO: filter out by one audio by its title
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('index', {                             // render(filename (in this case jade file), what to pass to file with specified filename);
            "audioList" : result
          });
        } else {
          res.send('No documents found');
        }
        
        db.close();
      });
    }
  });
});

module.exports = router;
