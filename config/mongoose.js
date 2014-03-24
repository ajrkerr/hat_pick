var mongoose = require('mongoose');
var dbConfig = require('./db.json');
var env      = process.env.NODE_ENV || 'development';

// var mongoose = require('mongoose')
//   , Imager   = require('imager')

//   , config   = require('../../config/config')[env]
//   , imagerConfig = require(config.root + '/config/imager.js')
//   , Schema   = mongoose.Schema
//   , utils    = require('../../lib/utils')

module.exports = function (app) {
  var connectString = dbConfig[env].connectString;
  mongoose.connect(connectString);
}
