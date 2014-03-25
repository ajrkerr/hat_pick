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

  describe('read operations', function () {
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

  describe('Upsert operations', function () {
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
  });

  describe('Remove operations', function () {
    it('should remove a random item', function (done) {
      var name  = 'TestList';
      var items = ['Marko'];
      var list  = new List({name: name});

      var req = { params: { name: name } };
      var res = {
        send: function (data) {
          assert.lengthOf(data.list.items, 0);
          assert.notInclude(data.list.items, items[0]);
          done();
        }
      };

      list.save( function (err, list) {
        listController.removeItem(req, res);
      });
    });

    it('should remove a specific item', function (done) {
      var name  = 'TestList';
      var items = ['Marko', 'Polo'];
      var removeItem = 'Polo';
      var list  = new List({name: name, items: items});

      var req = { params: { name: name, item: removeItem } };
      var res = {
        send: function (data) {
          assert.lengthOf(data.list.items, 1);
          assert.notInclude(data.list.items, removeItem);
          done();
        }
      };

      list.save( function (err, list) {
        listController.removeItem(req, res);
      });
    });

    it('should not remove an item that does not exist', function(done) {
      var name  = 'TestList';
      var items = ['Marko', 'Polo'];
      var removeItem = 'Lorem';
      var list  = new List({name: name, items: items});

      var req = { params: { name: name, item: removeItem } };
      var res = {
        send: function (data) {
          assert.lengthOf(data.list.items, 2);
          assert.include(data.list.items, items[0]);
          assert.include(data.list.items, items[1]);
          assert.notInclude(data.list.items, removeItem);
          done();
        }
      };

      list.save( function (err, list) {
        listController.removeItem(req, res);
      });
    });
  });

  describe('Add items', function () {
    it('should add an item to the list', function (done) {
      var name  = 'TestList';
      var items = ['Marko'];
      var newItem = 'Polo';
      var list  = new List({name: name, items: items});

      var req = { params: { name: name, item: newItem } };
      var res = {
        send: function (data) {
          var list = data.list;

          assert.lengthOf(list.items, 2);
          assert.include(list.items, newItem);
          done();
        }
      };

      list.save( function (err, list) {
        listController.addItem(req, res);
      });
    });
  });

  describe("existence checking", function () {
    it('should return true if an item exists', function (done) {
      var name  = 'TestList';
      var items = ['Marko'];
      var list  = new List({name: name, items: items});

      var req = { params: { name: name, item: items[0] } };
      var res = {
        send: function (data) {
          assert.equal(data, true);
          done();
        }
      };

      list.save( function (err, list) {
        listController.exists(req, res);
      });
    });

    it('should return false if an item does not exist', function (done) {
      var name  = 'TestList';
      var items = ['Marko'];
      var list  = new List({name: name, items: items});

      var req = { params: { name: name, item: 'Polo' } };
      var res = {
        send: function (data) {
          assert.equal(data, false);
          done();
        }
      };

      list.save( function (err, list) {
        listController.exists(req, res);
      });
    });

    it('should return false if no item is sent', function (done) {
      var name  = 'TestList';
      var items = ['Marko'];
      var list  = new List({name: name});

      var req = { params: { name: name, item: 'Polo' } };
      var res = {
        send: function (data) {
          assert.equal(data, false);
          done();
        }
      };

      list.save( function (err, list) {
        listController.exists(req, res);
      });
    });
  });
});
