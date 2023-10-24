'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');

//Variables related to the other JS files:
const services = require('./services.js');
const officiers = require('./officiers.js');
const tickets = require('./ticketserved.js'); 

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

/* 
  
  +--------------------------+
  | SERVICE FUNCTIONS BELOW: | 
  +--------------------------+

*/

app.get('/api/services', (req, res) => {
  services.GetServicesName()
    .then(services => res.json(services))
    .catch(() => res.status(500).end());
});

app.get('/api/:servicename/servicetime', (req, res) => {
  services.GetServiceTime(req.params.servicename)
    .then(services => res.json(services))
    .catch(() => res.status(500).end())
});

app.put('/api/:servicename/updatetime', IsLoggedIn, [/* check with express-validator if necessary */],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.status(422).json({ errors: errors.array() });
    } else {
      try {
        const service = {
          servicename: req.params.servicename,
          time: req.body.servicetime
        }
        const updateService = await services.SetNewServiceTime(service);
        res.json(updateService);
      } catch (err) {
        console.log(err)
        res.status(503).json({ error: `Database error during the edit of the page  ${req.params.servicename}.` });
      }
    }
  }
);

app.post('/api/services/add', IsLoggedIn, [/* check with express-validator if necessary */],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.status(422).json({ errors: errors.array() });
    } else {
      try {
        const service = {
          servicename: req.body.servicename,
          servicetime: req.body.servicetime
        }
        const newService = await services.AddService(service);
        res.json(newService);
      } catch (err) {
        console.log(err)
        res.status(503).json({ error: `Database error during the add of the page  ${req.params.id}.` });
      }
    }

  }
);