
var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const jwt = require('jsonwebtoken');
const config = require('../config.js')
const db = require("../models");
const User = db.user

 app.get("/users/email/:email", function(req, res){

  var q = `SELECT * FROM db_3dbia.tbl_users where email = '${req.params.email}'`

  connection.query(q, function (error, results) {
  if (error) throw error;
  
  res.send(results);
  });
 });

 app.post("/auth/login", function(req, res){

  try {
    User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password,
      }
    }).then(result => {

      const user = result.dataValues
    
      const token = jwt.sign({ 
        email: user.email, 
        password: user.password, 
        type: user.type,
        expiresIn: '7 days'
      }, config.secret);

      const response = {
        user,
        access_token: token
      };
      res.send(response)
      // return [200, response];
    });
  } catch (error) {
    res.send(error)
  }


 });
 app.post("/auth/access-token", function(req, res){

  try {
    // const { id } = jwt.verify(req.body.data.access_token, config.secret);
    const decoded = jwt.verify(req.body.data.access_token, config.secret)


    User.findOne({
      where: {
        email: decoded.email,
      }
    }).then(result => {
  
      const user = result.dataValues
    
      const updatedAccessToken = jwt.sign({ 
        email: decoded.email, 
        password: decoded.password, 
        type: decoded.type,
        expiresIn: '7 days'
      }, config.secret);

      const response = {
        user,
        access_token: updatedAccessToken
      };
      res.send(response)
      // return [200, response];
    });

	} catch (e) {
    const error = 'Invalid access token detected';
    res.send(error)
		// return [401, { error }];
	}
 });
 
