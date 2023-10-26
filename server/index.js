'use strict';

const express = require('express');
const morgan = require('morgan');
const { validationResult, param, body } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');
const dayjs = require('dayjs');

//Variables related to the other JS files:
const services = require('./services.js');
const officers = require('./officers.js');
const tickets = require('./ticketserved.js');
const bridge = require('./bridge.js');


/* 
  
  +--------------------------+
  | INIZIALIZATION PASSPORT: | 
  +--------------------------+

*/

//Local strategy implements httpOnly
passport.use(new LocalStrategy(
  function (username, password, done) {
    officers.getUser(username, password).then((user) => {
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
  officers.getUserById(id)
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

app.put('/api/:servicename/updatetime', IsLoggedIn, [
  body('servicename').isAlpha().isLength({ min: 1 }),
  body("servicetime").isInt({ min: 0 })
], async (req, res) => {
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
      const updateService = await services.SetNewServiceTime(service);
      res.json(updateService);
    } catch (err) {
      console.log(err)
      res.status(503).json({ error: `Database error during the edit of the page  ${req.params.servicename}.` });
    }
  }
}
);


/* 
  
  +-------------------------+
  | BRIDGE FUNCTIONS BELOW: | 
  +-------------------------+

*/

app.get('/api/services/:id', [
  param("id").notEmpty().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const numservices = await bridge.GetNumberOfServicePerOfficer(req.params.id);
      res.json(numservices);
    } catch (err) {
      console.log(err)
      res.status(503).json({ error: `Database error during the edit of the page  ${req.params.servicename}.` });
    }
  }
});


/* 
  
  +-------------------------------+
  | TICKETSERVED FUNCTIONS BELOW: | 
  +-------------------------------+

*/

//Is invoked when a client request a new service
app.post('/api/tickets/add', [
  body("servicename").isAlpha().isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const ticket = {
        servicename: req.body.servicename,
        requesttime: JSON.stringify(dayjs()),
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

//Get next ticket
app.get('/api/tickets/:servicename', [
  param('servicename').isAlpha().isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const ticket = {
        servicename: req.params.servicename,
        starttime: JSON.stringify(dayjs())
      }
      const getNextTicket = await tickets.getNextTicket(ticket);
      res.json(getNextTicket);
    } catch (err) {
      if (err == 0) {
        res.status(503).json({ error: `There is not ticket for service:  ${req.params.servicename}.` });
      } else {
        console.log(err)
        res.status(503).json({ error: `Database error during extract ticket for service:  ${req.params.servicename}.` });
      }
    }
  }
}
);

//Is invoked when an officer finish to serve a client
app.put('/api/tickets/update', [
  body("id").notEmpty().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const ticket = {
        id: req.body.id,
        endtime: JSON.stringify(dayjs()),
      }
      const updateTicket = await tickets.updateEndTimeTicket(ticket);
      res.json(updateTicket);
    } catch (err) {
      console.log(err)
      res.status(503).json({ error: `Database error in updating ticket id: ${req.body.id}.` });
    }
  }
}
);

//Is invoked if the client corresponding to the selected ticket there is not
app.delete('/api/tickets/delete/:id', [
  param("id").notEmpty().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const deleteTicket = await tickets.DeleteTicket(req.params.id);
      res.json(deleteTicket);
    } catch (err) {
      if (err == 0) {
        res.status(503).json({ error: `There is not ticket with id:  ${req.params.id}.` });
      } else {
        console.log(err)
        res.status(503).json({ error: `Database error during removing ticket id:  ${req.params.id}.` });
      }
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
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Unauthenticated user!" });
  }
});

// Logout
app.delete('/api/sessions/current', (req, res) => {
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
