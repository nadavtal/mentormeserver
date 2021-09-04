var express = require('express');
var app = module.exports = express();
const db = require('../models/index')

app.post("/add-resource", async function(req, res){

  try {
    const resource = await db.resource.create({
      name: req.body.name,
      link: req.body.link,
      type: req.body.type,
      lastUpdated: req.body.lastUpdated,
      uploadedByUserId: req.body.uploadedByUserId,
      cost: req.body.cost,
      views: req.body.views,
      enrolled: req.body.enrolled,
      rate: req.body.rate,
      subjectId: req.body.subjectId,
      jobId: req.body.jobId,
      fieldId: req.body.fieldId,
    })

    res.send(resource)
  }
  catch (err) {
    res.send(err)
  }

 });
