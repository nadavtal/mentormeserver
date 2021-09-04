
var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const messagesController = require('../controllers/messagesController')
const db = require('../models/index')



app.post("/messages", messagesController.createMessages);
app.get("/messages/users/:userId", messagesController.getUserMessages);
app.get("/messages/:id", messagesController.getMessage);
app.put("/messages/:id/status", messagesController.updateMessageStatus);
