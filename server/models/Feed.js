const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
  id: String, // a short id for the feed
  title: String,
  color: String,
  order: Number,
  newsItems: Array,
  userId: String,
  lastRefresh: { type: Date, default: 0 }
});

// get updated news from Bing
feedSchema.methods.refresh = function() {
  return new Promise((resolve, reject) => {
    this.newsItems.push({title:'A news item'});
    this.save().then(() => resolve(this));
  });
}

var Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
