var logfmt   = require("logfmt");
var express  = require('express');

module.exports = function (app) {
  app.configure(function() {
    // app.use(express.static(__dirname + '/public'));
    // app.use(express.logger('dev'));             // log every request to the console
    app.use(express.bodyParser());               // pull information from html in POST
    app.use(express.methodOverride());            // simulate DELETE and PUT
    app.use(logfmt.requestLogger());

    // Static Assets //
    app.use(express.static('public'));
  });
};

console.log("DirName: %s", __dirname);
