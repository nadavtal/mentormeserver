
var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const config = require('../config.js')
const db = require('../models/index');
const keyword_extractor = require("keyword-extractor");
const getSubjectsByString = require('../controllers/subjectsController').getSubjectsByString;

app.get("/shared-data", async function(req, res){

  try {
    const fields = await db.field.findAll({
      include: [
        {
          model: db.job,
          include: [
            {
              model: db.subject
            },
          ]
        },
      ]
    })
    const jobs = await db.job.findAll({
      include: [
        {
          model: db.subject,
          include: [
            {
              model: db.subject,
              as: 'relatedSubjects'
            },
          ]
        },
      ]
    })
    const subjects = await db.subject.findAll({
      include: [
        {
          model: db.job,
          include: [
            {
              model: db.field
            }
          ]
        },
        {
          model: db.subject,
          as: 'relatedSubjects'
        },
      ]
    })

    const response = {
      fields,
      jobs,
      subjects,
      // fieldsJobs,
      // jobsSubjects,
      // relatedsubjects
    }
    res.send(response)

  } catch (error) {
    throw error
    res.send(error)
  }
 });
app.get("/relevatWords", async function(req, res){
  console.log(req.query)
  const extraction_result = keyword_extractor.extract(req.query.string, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
  // console.log(extraction_result)
  let results = []
  let subjectIds = []
  for (let string of extraction_result) {
    const subjects = await getSubjectsByString(string);
    console.log(subjects)
    if (subjects.length) {
      subjects.forEach(subject => {
        if (!subjectIds.includes(subject.dataValues.id)) {
        results.push(subject)
        subjectIds.push(subject.dataValues.id)
        }
      })
    }

  }
  res.send(results)
 });

app.post("/users", function(req, res){

  const user = req.body
  const token = jwt.sign({ 
    email: user.email, password: user.password 
  }, config.secret);
  var q = `INSERT INTO tbl_users (
     user_name, password, phone, status, remarks, first_name, 
     last_name, date_created, user_image, email, address, confirmation_token )
  VALUES
  ( '${user.user_name}', '${user.password}', '${user.phone}', 'created', '${user.remarks}', 
  '${user.first_name}', '${user.last_name}', now(), '', '${user.email}', '${user.address}',
  '${token}');`

  connection.query(q, function (error, results) {
  if (error) throw error;
  
  user.id = results.insertId
  res.send({user, token});
  });
 });
 