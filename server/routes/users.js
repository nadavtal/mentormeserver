
var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const usersController = require('../controllers/usersController')
const db = require('../models/index')

app.get("/users", function(req, res){
  var q = 'SELECT * FROM users';
  connection.query(q, function (error, results) {
  if (error) throw error;

  res.send(results);
  });
 });
app.post("/users", usersController.createUser);
app.get("/users/:id", usersController.getUser);
app.get("/users/:id/data", usersController.getUserData);
app.get("/users/:id/basicData", usersController.getUserBasicData);
app.get("/users/:id/fields", usersController.getUserFields);
app.get("/users/:id/jobs", usersController.getUserJobs);
app.put("/users/:id/subjects/:subjectId", usersController.changeSubjectPrice);
app.get("/users/:id/subjects", usersController.getUserSubjects);
app.get("/users/:id/sessions", usersController.getUserSessions);
app.get("/users/:id/skills", usersController.getUserSkills);
app.put("/users/:id/skills", usersController.updateUserSkills);
app.put("/users/:id/skills/:skillId", usersController.changeSkillPrice);
app.post("/users/:id/follow/:userId", usersController.followUser);
app.put("/users/:id/follow/:userId", usersController.updateFollowUserStatus);