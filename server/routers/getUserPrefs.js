var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
//local files
var API_KEY = require('../config.js').API_KEY;
var userPrefController = require('../../db/controllers/userPrefsCtrl.js');

var router = express.Router();


//Getting user from database for front end
router.route('/:username')
.get(function(req, res) {
  //username from request parameters
  var username = req.params.username;
  //searh db for username prefs by username
  userPrefController.findOne(username, function(err, data) {
    if(err) {
      console.error(err);
    } else {
      res.status(200).send(data);
    }
  })
});

//Updating a user's preferences for custom news 1 and 2
router.route('/edit')
.put(function(req, res) {
  //searh db for username prefs by username
  var user = jwt.decode(req.body.user, 'secret');
  if (user.username === undefined) {
    user = user[0];
  }
  userPrefController.updateOne(user.username, req.body.field, req.body.value, function(err, data) {
    if(err) {
      console.error(err);
    } else {
      res.status(201).send(data);
    }
  })
});

//Creating a new user, sign up
// router.route('/signup')
// .post(function(req, res) {
//   //must have password confirm and confirm must match password
//   if (req.body.confirm && req.body.password === req.body.confirm) {
//     userPrefController.insertOne({username: req.body.username, password: req.body.password}, function(err, data) {
//       if(err) {
//         console.error(err);
//         res.status(201).send('Cannot create new user');
//       } else {
//         var token = jwt.encode(data, 'secret');
//         res.status(201).send(token);
//       }
//     });
//   } else {
//     res.status(401).send();
//   }
// });
//
// //Logging in
// router.route('/login')
// .post(function(req, res) {
//
//   var username = req.body.username;
//   var password = req.body.password
//   //searh db for username prefs by username
//   userPrefController.findOne(username, function(err, data) {
//     if(err) {
//       console.error(err);
//     } else {
//       if (data[0]) {
//         data[0].comparePasswords(password)
//         .then(function(){
//           var token = jwt.encode(data, 'secret');
//           res.status(201).send(token);
//         });
//       } else {
//         res.status(201).send('User does not exist');
//       }
//     }
//   });
// });


module.exports = router;
