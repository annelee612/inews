const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
  title: String,
  color: String,
  order: Number,
  newsItems: Array,
  userId: String
});

var Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
