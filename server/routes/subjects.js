var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const db = require('../models/index')

const subjectsController = require('../controllers/subjectsController');

// app.get("/subjects/:id/:dataType", subjectsController.getSubjectData)
app.get("/subjects", subjectsController.getSubjects);
app.get("/subjects/:id", subjectsController.getSubjectData)
// app.get("/subjects/:id/:data", subjectsController.getSubjectData)

app.post("/subjects", subjectsController.createNewSubject)
app.put("/subjects", subjectsController.updateSubject)

app.post("/add-subject-to-user", function(req, res){

  try {
    db.user_subjects
      .create(req.body)
      .then(connectionResult => {
        res.send(connectionResult);
      });

  } catch (err) {
    res.send(err)
  }
 });