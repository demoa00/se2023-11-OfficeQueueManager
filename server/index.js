'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');

const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'))

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

//Local strategy implements httpOnly
passport.use(new LocalStrategy(
  function (username, password, done) {
    users.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

//Serialization of the data of the session (URL): 
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Deserializzazion:
passport.deserializeUser((id, done) => {
  users.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
});

//Function who verify if the user is logged in
const IsLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

//Setup of the session
app.use(session({
  secret: 's3Cr3t$r!ng4th3S3$s10N', 
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());





//Server activation:
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
  