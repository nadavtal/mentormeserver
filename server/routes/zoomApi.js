var express = require('express');
var app = module.exports = express();
const db = require('../models/index')
const zoomController = require('../controllers/zoomController');
const messagesController = require('../controllers/messagesController');
 
app.get("/zoom/users", zoomController.getUsers)
app.post("/zoom/meetings", zoomController.createMeeting);
