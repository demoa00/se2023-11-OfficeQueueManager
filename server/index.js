'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult, param, body } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');
const dayjs = require('dayjs');

//Variables related to the other JS files:
const services = require('./services.js');
const officiers = require('./officiers.js');
const tickets = require('./ticketserved.js');
const bridge = require('./bridge.js');

/* 
  
  +-------------------------+
  | INIZIALIZATION PASSPORT: | 
  +-------------------------+

*/

//Local strategy implements httpOnly
passport.use(new LocalStrategy(
  function (username, password, done) {
    officiers.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect email and/or password.' });

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
  officiers.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
});

/* 
  
  +-------------------------+
  | INIZIALIZATION EXPRESS: | 
  +-------------------------+

*/

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

//Function who verify if the user is logged in
const IsLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

//Function who verify if the user has admin privileges
const IsAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin == 1)
    return next();

  return res.status(403).json({ error: 'Not enough requirements' });
}

//Setup of the session
app.use(session({
  secret: 's3Cr3t$r!ng4th3S3$s10N',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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

app.get('/api/:servicename/servicetime', [
  param('servicename').isAlpha().isLength({ min: 1 })
], (req, res) => {
  services.GetServiceTime(req.params.servicename)
    .then(services => res.json(services))
    .catch(() => res.status(500).end())
});

app.put('/api/updatetime?servicename=value', IsLoggedIn, [
  param('servicename').isAlpha().isLength({ min: 1 }),
  body("servicetime").isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const service = {
        servicename: req.params.servicename,
        servicetime: req.body.servicetime
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

/* 
  
  +-------------------------------+
  | TICKETSERVED FUNCTIONS BELOW: | 
  +-------------------------------+

*/

app.post('/api/tickets/add', IsLoggedIn, [ body("servicename").isAlpha().isLength({min : 1}) ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.status(422).json({ errors: errors.array() });
    } else {
      try {
        const ticket = {
          servicename: req.body.servicename,
          servicetime: JSON.stringify(dayjs()),
        }
        const newTicket = await tickets.NewTicket(ticket);
        res.json(newTicket);
      } catch (err) {
        console.log(err)
        res.status(503).json({ error: `Database error during the add of the page  ${req.params.id}.` });
      }
    }
  }
);

app.put('/api/tickets/update', IsLoggedIn, [/*express-validator check if necessary*/], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const ticket = {
        id: req.body.id,
        realtime: JSON.stringify(dayjs())
      }
      const updateTicket = await tickets.UpdateTicket(ticket);
      res.json(updateTicket);
    } catch (err) {
      console.log(err)
      res.status(503).json({ error: `Database error during the edit of the page  ${req.body.id}.` });
    }
  }
}
);

/* 
  
  +------------------------+
  | LOGIN FUNCTIONS BELOW: | 
  +------------------------+

*/

app.post('/api/sessions', [
  body('email').isEmail(),
  body('password').isLength({ min: 3 })
], (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json(req.user);
    });
  })(req, res, next);
});

// Check whether the user is logged in or not
app.get('/api/sessions/current', IsLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Unauthenticated user!" });
  }
});

// Logout
app.delete('/api/sessions/current', IsLoggedIn, (req, res) => {
  req.logOut(() => res.end());
});

/* 
  
  +-----------------------------------+
  | SERVER ACTIVATION FUNCTION BELOW: | 
  +-----------------------------------+

*/

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/* 
  
  +-------------------------+
  | BRIDGE FUNCTIONS BELOW: | 
  +-------------------------+

*/


app.get('/api/services/:id', (req, res) => {
  bridge.GetNumberOfServicePerOfficier(req.params.id)
    .then(numservices => res.json(numservices))
    .catch(() => res.status(500).end());
});