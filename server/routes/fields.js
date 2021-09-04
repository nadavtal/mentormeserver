var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const db = require('../models/index')

app.get("/fields", function(req, res){

  try {
    db.field.findAll().then(fields => {
      res.send(fields)
    })

  } catch (error) {
    res.send(error)
  }
 });
app.get("/fields/:id", async function(req, res){

  try {
    const field = await db.field.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.subject,
        },
        {
          model: db.job,
        }
      ]
    })
    res.send(field)
  } catch (error) {
    res.send(error)
  }
 });
app.get("/fields/:id/jobs", async function(req, res){

  try {
    const fieldJobs = await db.field_jobs.findAll({
      where: {
        fieldId: req.params.id
      }
    })
    res.send(fieldJobs)
  } catch (error) {
    res.send(error)
  }
 });
app.post("/add-field", function(req, res){

  try {
    db.field.create({
      name: req.body.name,
      description: req.body.description,
    }).then(fieldResult => {
        
        const newField = fieldResult.dataValues
        db.user_fields.create({
          userId: req.body.userId,
          fieldId: newField.id
        }).then(connectionResult => {
            res.send(newField)
        })
    })

  } catch (error) {
    res.send(error)
  }
 });
app.post("/add-field-to-user", function(req, res){
 
  try {
    db.user_fields.create({
      userId: req.body.userId,
      fieldId: req.body.id
    }).then(connectionResult => {
        res.send(req.body)
    })

  } catch (err) {
    res.send(err)
  }
 });