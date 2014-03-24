// set up ========================
"use strict";

var express  = require('express');
var app      = express();                 // create our app w/ express
var fs       = require("fs");

var configDir = "config";
var routesDir = "routes";

// Requires a folder, and treats the export as a function to call
function requireFolder(folder, app, filter) {
  filter = filter || /\.js$/;

  fs.readdirSync(folder).forEach(function (file) {
    if(filter.test(file)) {
      var filename = "./" + folder + "/" + file;
      console.log("Loading " + filename);

      require(filename)(app);
    }
  });
}

console.log("Including Config");
requireFolder(configDir, app);

console.log("Including Routes");
requireFolder(routesDir, app);

// Setup the web server
var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
  console.log("Listening on " + port);
});
