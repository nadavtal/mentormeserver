
var express = require('express');
var app = module.exports = express();
const mentorsController = require('../controllers/mentorsController')
const db = require('../models/index')

app.get("/mentors", mentorsController.getMentors);
