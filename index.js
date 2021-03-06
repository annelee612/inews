var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var bodyParser = require('body-parser');

//local files
var newsRouter = require('./server/routers/getnews.js');
var userPrefsRouter = require('./server/routers/getUserPrefs.js');
const feedRouter = require('./server/routers/getFeed.js');
const specialRouter = require('./server/routers/getSpecial.js');

var config = require('./server/config.js');

//models
const User = require('./server/models/User.js');

//auth stuffs
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
const request = require('request-promise');

const server = express();

//connections
server.set('port', (process.env.PORT || 5000) );
var env = process.env.NODE_ENV;
var mongoURI = env === 'TEST' ? config.MONGODB_LOCAL_URI : config.MONGODB_STAGING_URI;
mongoose.connect(mongoURI);
var db = mongoose.connection;

db.on('error',console.error);
    // close the database connection on process exit
    var gracefulExit = function() {
      db.close(function () {
        console.log('Database connection safely closed.');
        process.exit(0);
      });
    }
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

//middleware
server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(__dirname + '/client'));

// add authentication
server.use(require('cookie-parser')());
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
server.use(expressSession({ secret: 'mysecret', resave:true, saveUninitialized:true, store: new MongoStore({mongooseConnection:db, collection:'session'})}));
server.use(passport.initialize());
server.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(mongoose.mongo.ObjectId(id), function(err, user) {
    done(null, user);
  });
});
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (!user.validPassword(password)) { return done(null, false); }
    return done(null, user);
  });
}));

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://secure.meetup.com/oauth2/authorize',
    tokenURL: 'https://secure.meetup.com/oauth2/access',
    clientID: 'sprubjng8i09562ii0a9guehnl',
    clientSecret: 'dsmkav5bh3mf1lcc9tljq9u7f4',
    callbackURL: "http://localhost:3000/authstep2"
  },
  function(accessToken, refreshToken, profile, done) {
    var options = {
      method: 'GET',
      url: 'https://api.meetup.com/2/member/self/',
      headers: {
            'Authorization': 'Bearer '+accessToken
        }
    };
    request(options).then(content => {
      content = JSON.parse(content);
      var newuser = new User({username:content.name});
      newuser.password = accessToken;
      User.findOne({username: content.name}).then(user => {
        if (!user) {
          newuser.save(function(err,data) {
            return done(null, data);
          });
        } else {
          return done(null, user);
        }
      });
    });
  }
));

server.get('/auth', passport.authenticate('oauth2', { scope : ['basic', 'group_join', 'ageless'] }));
server.get('/authstep2', passport.authenticate('oauth2', {failWithError: true}),
  function(req, res, next) {
    console.log(req.user);
    res.redirect('/?user='+JSON.stringify(req.user));
  },
  function(err, req, res, next) {
    res.json({message: 'Login failed, incorrect username or password'});
  }
);

//routes middleware point to ./server/routers/...
server.use('/api/getnews', newsRouter);
server.use('/api/user', userPrefsRouter);
server.use('/api/newsfeeds', feedRouter);
server.use('/api', specialRouter);

server.all('/login', passport.authenticate('local', {failWithError: true}),
  function(req, res, next) {
    res.json({user: req.user});
  },
  function(err, req, res, next) {
    res.json({message: 'Login failed, incorrect username or password'});
  }
);

server.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

server.post('/signup', function (req, res) {
  var newuser = new User({username:req.body.username});
  newuser.password = newuser.generateHash(req.body.password);
  newuser.save(function(err,data) {
    res.json({message: 'Successfully created user', username: req.body.username});
  });
});

server.listen(server.get('port'), function () {
  console.log('listening');
});

module.exports = server;
