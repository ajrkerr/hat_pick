// web.js
var express = require("express");
var logfmt  = require("logfmt");
// var mongo   = require('mongodb');


// Expresss Framework
var app     = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// Setup the web server
var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
  console.log("Listening on " + port);
});

// Setup Mongo
// var mongoUri = process.env.MONGOLAB_URI ||
//   process.env.MONGOHQ_URL ||
//   'mongodb://localhost/mydb';

// mongo.Db.connect(mongoUri, function (err, db) {
//   db.collection('mydocs', function(er, collection) {
//     collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
//     });
//   });
// });