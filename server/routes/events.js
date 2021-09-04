
var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const config = require('../config.js')
const eventsController = require('../controllers/eventsController')

app.get("/events", function(req, res){

  var q = 'SELECT * FROM events';
  connection.query(q, function (error, results) {
  if (error) throw error;

  res.send(results);
  });
 });
app.post("/events", eventsController.createEvent);
app.get("/events/host/:id", eventsController.getEventsByHostId);


