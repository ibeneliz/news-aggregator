var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const cachedKeysScheme = new Schema({
  articlekey: {
    type: String,
  },
});

module.exports = mongoose.model('cachedKeys', cachedKeysScheme);