// RESTFul Routes for the list object
var _        = require('lodash');
var mongoose = require('mongoose');
var List     = require('../models/list');


module.exports = {
  index: function (req, res) {
    List.find(undefined, function (err, lists) {
      var result = { lists: lists };
      res.send(err || result);
    });
  },

  show: function (req, res) {
    var name = req.params.name;

    // Find the list somehow
    List.findOne({"name": name}, function (err, list) {
      var result = { list: list };
      res.send(err || result);
    });
  },

  upsert: function (req, res) {
    // Find the req information
    var name    = req.params.name;

    var items   = req.params.items;
    var newName = req.params.newName;

    List.findOne({name: name}, function (err, list) {
      list = list || new List({name: name});

      if(newName) {
        list.name = newName;
      }

      list.setItemsFromString(items);

      list.save(function (err, list) {
        res.send(err || {list: list});
      });
    });
  },

  delete: function (req, res) {
    var name = req.params.name;

    // Find the list somehow
    List.find({"name": name}, function (err, list) {
      if(list) {
        list.remove(function (err) {
          res.send(err);
        });
      }
    });
  },

  pickItem: function (req, res) {
    var name    = req.params.name;
    // var exclude = req.params.exclude;

    // Find the list somehow
    List.findOne({"name": name}, function (err, list) {
      var numItems   = list.items.length;
      var pick       = Math.floor(numItems * Math.random());

      var result     = { item: list.items[pick] };

      res.send(err || result);
    });
  },

  removeItem: function (req, res) {
    var name    = req.params.name;
    var item    = req.params.item;

    // Find the list somehow
    List.findOne({"name": name}, function (err, list) {
      if(err) { res.send(err); return; }

      var index;
      // If no index is provided, remove random item //
      if(item == undefined) {
        index = (Math.random() * list.items.length);
      } else {
        index = list.items.indexOf(item);
      }

      // Remove item //
      if(index !== -1) {
        list.items.splice(index, 1);

        // Try to save change //
        list.save(function (err, list) {
          if(err) { res.send(err); return; }
          res.send({list: list});
        });
      } else {
        res.send({ list: list });
      }
    });
  },

  addItem: function(req, res) {
    var name    = req.params.name;
    var item    = req.params.item;

    // Find the list somehow
    List.findOne({"name": name}, function (err, list) {
      if(err) { res.send(err); return; }

      list.items.push(item);

      list.save(function (err, list) {
        res.send(err || { list: list });
      });
    });
  },

  exists: function (req, res) {
    var name    = req.params.name;
    var item    = req.params.item;

    // Find the list somehow
    List.findOne({"name": name}, function (err, list) {
      if(err) { res.send(err); return; }

      var index = list.items.indexOf(item);
      res.send(index !== -1);
    });
  }
};
