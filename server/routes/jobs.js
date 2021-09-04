var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const db = require('../models/index')
const jobsController = require('../controllers/jobsController')
app.get("/jobs/:id", jobsController.getJob);


 app.get("/jobs/:id/subjects", async function(req, res){

  try {
    const jobSubjects = await db.job_subjects.findAll({
      where: {
        jobId: req.params.id
      }
    })
    res.send(jobSubjects)
  } catch (error) {
    res.send(error)
  }
 });
app.post("/add-job", async function(req, res){

  try {
    const job = await db.job.create({
    name: req.body.name,
    description: req.body.description,
    })

    const fieldJob = await db.field_jobs.create({
      jobId: job.dataValues.id,
      fieldId: req.body.field
    })

    const userJob = await db.user_jobs.create({
      userId: req.body.userId,
      jobId: job.dataValues.id
    })

    res.send(job.dataValues)
  }
  catch (err) {
    res.send(err)
  }
 });

 app.post("/add-job-to-user", function(req, res){

  try {
    db.user_jobs.create({
      userId: req.body.userId,
      jobId: req.body.id
    }).then(connectionResult => {
        res.send(req.body)
    })

  } catch (err) {
    res.send(err)
  }
 });