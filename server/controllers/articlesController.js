
const db = require('../models/index')
const sessionsController = require('./sessionsController')
const sequelize = require("sequelize");
const {or, and, gt, lt} = sequelize.Op;
const keyword_extractor = require("keyword-extractor");
const axios = require('axios');
const cheerio = require('cheerio');
const getSubjectsByWord = require('./subjectsController').getSubjectsByWord

const getArticles = async (req, res) => {
  console.log('getArticles', req.query)
  if (req.query.name.includes(' ')) {
    let allArticles = []
    const extraction_result = keyword_extractor.extract(req.query.name, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    console.log('extraction_result'. extraction_result)
    for (let word of extraction_result) {
      if (word.length) {
        try {
          const articles = await db.article.findAll({
            where: {
              name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + word + '%')
            },
          })
          allArticles = [...allArticles, ...articles]
          
        } catch (err) {
          throw err
        }

      }
    }
    res.send(allArticles)
  } else {
    try {
      const articles = await db.article.findAll({
        where: {
          name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.query.name + '%')
        },
      })
      res.send(articles)
    } catch (err) {
      throw err
    }

  }
}

const getArticle = async (req, res) => {
  try {
    const article = await db.article.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.article,
          as: 'relatedArticles'
        }
      ]
    })
    res.send(article)
  } catch (error) {
    throw error
    // res.send(error)
  }
 };
const createArticle = async (req, res) => {
  try {
    const article = await db.article.create({
      link: req.body.newArticle.link,
    })

    const articleId = article.dataValues.id
    let userArticleData = {...req.body.userArticle};

    userArticleData['articleId'] = articleId;

    const userArticle = await db.user_articles.create(userArticleData)
    const articleSubjects = req.body.subjectsIds.map(subjectId => {
      return {
        subjectId,
        articleId
      }
    })
    const articleSubjectsRes = await db.article_subjects.bulkCreate(articleSubjects, {
      returning: true
    })
    res.send(article)
  }
  catch (err) {
    res.send(err)
  }
 };


const getArticlesByString = async (string) => {
  try {
    const articles = await db.article.findAll({
      where: {
        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('article.name')), 'LIKE', '%' + string + '%')
      },
      include: [
        {
          model: db.field,
          include: [
            {
              model: db.article,
            }
          ]
        },
        {
          model: db.article,
          as: 'relatedArticles',
          // where: {
          //   required: true
          // }
        },
      ]
    })
    return articles
  } catch (error) {
    throw error
    // res.send(error)
  }
 };
const getArticleData = async (req, res) => {

  const query = JSON.parse(req.query.data)
  // console.log('query', query)
  // if (query.length == 1) {
  //   switch (query.dataType) {
  //     case 'session':
  //       try {
  //         const sessions = await sessionsController.getSessionsFunction([{articleIds: [req.params.id]}])
  //         res.send(sessions)
  //       } catch (err) {
  //         throw err
  //       }
  //       break;
    
  //     default:
  //       break;
  //   }

  // }
  const includes = query.map(data => {
     return data.includes 
    ? {
      model: db[data.dataType],
      where: data.where ? data.where : null,  
      include: [
        ...data.includes.map(dataType => {
        return {
          model: db[dataType]
        }
      })]       
    } 
    : {
      model: db[data.dataType],
      where: data.where ? data.where : null
    }
  })

  try {
    const article = await db.article.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.article,
          as: 'relatedArticles'
        },
        ...includes
      ]
    })
    res.send(article)
  } catch (error) {
    throw error
    // res.send(error)
  }
 };

const url = 'https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1';

const scrapArticle = async (req, res) => {
  console.log(req.query)
  axios(req.query.url)
  .then(async response => {
    const html = response.data;
    // console.log(html);
    const $ = cheerio.load(html);
    const h1Objects = $('h1');
    // console.log(linkObjects)
    let allSubjects = []
    let subjectsIds = []
    // h1Objects.each( async (index, element) => {
    for (let element of h1Objects) {
      const text = $(element).text()
      const extraction_result = keyword_extractor.extract(text, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });
      console.log(extraction_result)
      for (let word of extraction_result) {
        if (word.length) {
          const subjects = await getSubjectsByWord(word, true)
          if (subjects && subjects.length) subjects.forEach(subject => {
            if (!subjectsIds.includes(subject.dataValues.id) ) {
              allSubjects.push(subject)
              subjectsIds.push(subject.dataValues.id)
            }
          })
        }
      }
    }
    // });
    // console.log(allSubjects)
    res.send(allSubjects)

  })
  .catch(err => res.send(err));
}

// scrapArticle(url)
module.exports = {
  getArticle,
  getArticlesByString,
  getArticleData,
  getArticles,
  scrapArticle,
  createArticle
};