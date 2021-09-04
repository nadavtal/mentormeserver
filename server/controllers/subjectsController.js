
const db = require('../models/index')
const sessionsController = require('./sessionsController')
const sequelize = require("sequelize");
const {or, and, gt, lt} = sequelize.Op;
const keyword_extractor = require("keyword-extractor");

const getSubjects = async (req, res) => {
  console.log('getSubjects', req.query)
  let subjects
  if (req.query.name.includes(' ')) {
    let allSubjects = []
    const extraction_result = keyword_extractor.extract(req.query.name, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    console.log('extraction_result'. extraction_result)
    for (let word of extraction_result) {
      if (word.length) {
        subjects = await getSubjectsByWord(word)
        allSubjects = [...allSubjects, ...subjects]
        // try {
        //   const subjects = await db.subject.findAll({
        //     where: {
        //       name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + word + '%')
        //     },
        //   })
        //   allSubjects = [...allSubjects, ...subjects]
          
        // } catch (err) {
        //   throw err
        // }

      }
    }
    res.send(allSubjects)
  } else {
    subjects = await getSubjectsByWord(req.query.name)
    res.send(subjects)
    // try {
    //   const subjects = await db.subject.findAll({
    //     where: {
    //       name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.query.name + '%')
    //     },
    //   })
    //   res.send(subjects)
    // } catch (err) {
    //   throw err
    // }

  }
}

const getSubjectsByWord = async (word, exact) => {
  let subjects
  try {
    if (exact) {
      subjects = await db.subject.findAll({
        where: {
          name: word
        },
        include: {
          model: db.field
        }
      })
    } else {
      subjects = await db.subject.findAll({
        where: {
          name: sequelize.where(sequelize.fn('LOWER', sequelize.col('subject.name')), 'LIKE', '%' + word + '%')
        },
        include: {
          model: db.field
        }
      })

    }
    return subjects
    
  } catch (err) {
    throw err
  }
}
const getSubject = async (req, res) => {
  try {
    const subject = await db.subject.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.subject,
          as: 'relatedSubjects'
        },
        {
          model: db.article
        }
      ]
    })
    res.send(subject)
  } catch (error) {
    throw error
    // res.send(error)
  }
 };
const getSubjectsByString = async (string) => {
  try {
    const subjects = await db.subject.findAll({
      where: {
        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('subject.name')), 'LIKE', '%' + string + '%')
      },
      include: [
        {
          model: db.field,
          include: [
            {
              model: db.subject,
            }
          ]
        },
        {
          model: db.subject,
          as: 'relatedSubjects',
          // where: {
          //   required: true
          // }
        },
      ]
    })
    return subjects
  } catch (error) {
    throw error
    // res.send(error)
  }
 };
const getSubjectData = async (req, res) => {

  const query = JSON.parse(req.query.data)
  // console.log('query', query)
  // if (query.length == 1) {
  //   switch (query.dataType) {
  //     case 'session':
  //       try {
  //         const sessions = await sessionsController.getSessionsFunction([{subjectIds: [req.params.id]}])
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
    const subject = await db.subject.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.subject,
          as: 'relatedSubjects'
        },
        ...includes
      ]
    })
    res.send(subject)
  } catch (error) {
    throw error
    // res.send(error)
  }
 };

const createNewSubject = async (req, res) => {
  console.log(req.body)
  try {
    const subject = await db.subject.create({
      name: req.body.newSubject.name,
      description: req.body.newSubject.description,
      createdBy: req.body.newSubject.createdBy
    })

    const subjectId = subject.dataValues.id
    let userSubjectData = {...req.body.userSubject};

    userSubjectData['subjectId'] = subjectId;

    const userSubject = await db.user_subjects.create(userSubjectData)

    let fieldSubjects = req.body.newSubject.fieldsIds.map(fieldId => {
        return {
        subjectId: subjectId,
        fieldId: fieldId
      }
    })

    const fieldsSubject = await db.field_subjects.bulkCreate(fieldSubjects, {
      returning: true
    })

    let relatedSubjects = req.body.relatedSubjectsIds.map(subId => {
      return {
      subjectId: subjectId,
      relatedSubjectId: subId,
      required: true
      }
    })
    console.log('relatedSubjects', relatedSubjects)
    const subjectSubjects = await db.related_subjects.bulkCreate(relatedSubjects, {
      returning: true
    })
    console.log('subjectSubjects', subjectSubjects)
    subject.dataValues.user_subjects = userSubject.dataValues
    subject.dataValues.related_subjects = subjectSubjects.dataValues
    res.send(subject)
  }
  catch (err) {
    res.send(err)
  }
  
 };
const updateSubject = async (req, res) => {
  console.log(req.body)
  // try {
  //   const subject = await db.subject.create({
  //     name: req.body.newSubject.name,
  //     description: req.body.newSubject.description,
  //     createdBy: req.body.newSubject.createdBy
  //   })

  //   const subjectId = subject.dataValues.id
  //   let userSubjectData = {...req.body.userSubject};

  //   userSubjectData['subjectId'] = subjectId;

  //   const userSubject = await db.user_subjects.create(userSubjectData)

  //   let fieldSubjects = req.body.newSubject.fieldsIds.map(fieldId => {
  //       return {
  //       subjectId: subjectId,
  //       fieldId: fieldId
  //     }
  //   })

  //   const fieldsSubject = await db.field_subjects.bulkCreate(fieldSubjects, {
  //     returning: true
  //   })

  //   let relatedSubjects = req.body.relatedSubjectsIds.map(subId => {
  //     return {
  //     subjectId: subjectId,
  //     relatedSubjectId: subId,
  //     required: true
  //     }
  //   })
  //   console.log('relatedSubjects', relatedSubjects)
  //   const subjectSubjects = await db.related_subjects.bulkCreate(relatedSubjects, {
  //     returning: true
  //   })
  //   console.log('subjectSubjects', subjectSubjects)
  //   subject.dataValues.user_subjects = userSubject.dataValues
  //   subject.dataValues.related_subjects = subjectSubjects.dataValues
  //   res.send(subject)
  // }
  // catch (err) {
  //   res.send(err)
  // }
  
 };

module.exports = {
  getSubject,
  getSubjectsByString,
  getSubjectData,
  getSubjects,
  getSubjectsByWord,
  createNewSubject,
  updateSubject
};