"use strict";
// Testing Helpers //
var assert = require('chai').assert;

var dbURI    = 'mongodb://localhost/test';
var mongoose = require('mongoose');
var clearDB  = require('mocha-mongoose')(dbURI);

// Objects for this test //
var List           = require('../app/models/list');
var listController = require('../app/controllers/lists')


describe('API', function () {
  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it('should list all items', function (done) {
    var name   = 'TestList';
    var name2  = 'TestList2';
    var items  = ['Marko', 'Polo'];
    var items2 = ['Lorem'];
    var list   = new List({name: name, items: items});
    var list2  = new List({name: name2, items: items2});

    var req = { };
    var res = {
      send: function (data) {
        assert.equal(data.lists.length, 2);
        assert.equal(data.lists[0].name, name );
        assert.equal(data.lists[1].name, name2);
        done();
      }
    };

    list.save(function (err, list) {
      list2.save(function (err, list) {
        listController.index(req, res);
      });
    });
  });

  it('should return an item', function (done) {
    var name  = 'TestList';
    var items = ['Marko', 'Polo'];
    var list  = new List({name: name, items: items});

    var req = { params: { name: name } };
    var res = {
      send: function (data) {
        assert.equal(data.list.name, name);
        assert.equal(data.list.items.length, items.length);
        done();
      }
    };

    list.save( function (err, list) {
      listController.show(req, res);
    });
  });

  it('should update a list', function (done) {
    var name   = 'TestList';
    var name2  = 'TestList2';
    var items  = ['Marko', 'Polo'];
    var items2 = "Lorem\nIpsum\nDollar";
    var list   = new List({name: name, items: items});

    var req = { params: { name: name, items: items2, newName: name2 } };
    var res = {
      send: function (data) {
        assert.equal(data.list.isNew, false);
        assert.equal(data.list.name, name2);
        assert.equal(data.list.items.length, 3);
        done();
      }
    };

    list.save(function (err, list) {
      assert.equal(list.isNew, false);
      assert.equal(list.name, name);
      assert.equal(list.items.length, 2);
      listController.upsert(req, res);
    });
  });

  it('should create a new list', function (done) {
    var name  = 'TestList';
    var items = "Marko\nPolo";

    var req = { params: { name: name, items: items } };
    var res = {
      send: function (data) {
        assert.equal(data.list.isNew, false);
        assert.equal(data.list.name, name);
        assert.equal(data.list.items.length, 2);
        done();
      }
    };

    listController.upsert(req, res);
  });

  it('should return a random item from the list', function (done) {
    var name  = 'TestList';
    var items = ['Marko'];
    var list  = new List({name: name, items: items});

    var req = { params: { name: name } };
    var res = {
      send: function (data) {
        assert.equal(data.item, 'Marko');
        done();
      }
    };

    list.save( function (err, list) {
      listController.pickItem(req, res);
    });
  });

  it('should return nil from an empty list', function (done) {
    var name  = 'TestList';
    var items = [];
    var list  = new List({name: name, items: items});

    var req = { params: { name: name } };
    var res = {
      send: function (data) {
        assert.equal(data.item, null);
        done();
      }
    };

    list.save( function (err, list) {
      listController.pickItem(req, res);
    });
  });
});
