var express = require('express');
var app = module.exports = express();
const connection = require('../db.js');
const db = require('../models/index')

const articlesController = require('../controllers/articlesController');

// app.get("/articles/:id/:dataType", articlesController.getArticleData)
app.get("/articles", articlesController.getArticles);
app.get("/articles/:id", articlesController.getArticleData)


app.post("/articles", articlesController.createArticle)
app.post("/add-article-to-user", function(req, res){

  try {
    db.user_articles
      .create(req.body)
      .then(connectionResult => {
        res.send(connectionResult);
      });

  } catch (err) {
    res.send(err)
  }
 });

 app.get("/scrap", articlesController.scrapArticle)