const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();
const User = require("../model/userModel");
require('dotenv').config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,

    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.giveName,
        lastName: profile.familyName,
        profileImage: profile.photos[0].value,
      }
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user)
        } else {
          user = await User.create(newUser);
          done(null, user)
        }
      } catch (error) {
        console.log(error)

      }
    }
  )
);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: "/login-failure", successRedirect: "/dashboard" }));
router.get('/login-failure', (req, res) => {
  res.send('Something went wrong....')
})
router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
      res.send('Error loggin out')
    } else {
      res.redirect('/')
    }

  })
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  // User.findById(id, function (err, user) {
  //   done(err, user)
  // })
  User.findById(id).then(user =>{
    done(null,user)
  }).catch(err=>{
    done(err,null)
  })
})

module.exports = router;