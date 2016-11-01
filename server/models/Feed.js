const mongoose = require('mongoose');
const request = require('request-promise');

var API_KEY = require('../config.js').API_KEY;

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

    var options = {
      method: 'GET',
      url: 'https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=' + this.title + '&count=10&offset=0&mkt=en-us&safeSearch=Moderate',
      headers: {
            'Ocp-Apim-Subscription-Key': API_KEY
        }
    };
    //get request to bing with our bing API key
    request(options).then(content => {
      this.newsItems = content;
      this.lastRefresh = Date.now();
      this.save().then(() => resolve(this));
    });
  });
}

var Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
