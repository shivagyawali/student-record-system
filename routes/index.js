const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const students = require('../models/Student')
var std = students.find({});


// Public Route
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

//POST /AdminLogin -> authentificate the user
router.post('/',
  passport.authenticate('local', {
    successRedirect: '/students',
    failureRedirect: '/',
    failureFlash: true
  }), (req, res) => {
    req.flash('success_msg', 'You are successfully logged in ');
    res.redirect('/students');
  }
);


//Middleware for authentication -> provided by the passport library
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, 'Invalid password');
        }
      });
    });
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

//Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});


module.exports = router;
