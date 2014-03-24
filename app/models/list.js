// Dependencies
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Schema
var ListSchema = new Schema({
  name:  { type: String, default: '' },
  items: { type: Array , default: [] }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */


/**
 * Methods
 */

ListSchema.method({
  toString: function () {
    this.items.join("\n");
  },

  setItemsFromString: function (string) {
    this.items = string.split("\n");
  }
});


/**
 * Register
 */
module.exports = mongoose.model('List', ListSchema);
