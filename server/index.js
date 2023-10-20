'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');