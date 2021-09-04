var express = require('express');
var app = module.exports = express();
const db = require('../models/index')
const skillsController = require('../controllers/skillsController');

// app.get("/skills/:id", skillsController.getSkillData)
// app.get("/skills/:id/:data", skillsController.getSkillData)

app.get("/skills", skillsController.getSkills);
app.post("/create-skill", skillsController.createNewSkill);