var express = require('express');
var app = module.exports = express();
const db = require('../models/index')
const messagesController = require('../controllers/messagesController');
const sessionsController = require('../controllers/sessionsController');

app.get("/sessions",sessionsController.getSessions)

// try {
//   const sessions = await db.session.findAll({
//     include: [
//       {
//       model: db.user,
//       through: {
//         attributes: ['createdAt', 'startedAt', 'finishedAt'],
//         where: {completed: true}
//       }
//       },
//       {
//       model: db.subject,
//       },
//     ]
//   });;
//   res.send(sessions)
// } catch (err) {
//   throw err
//   res.send(err)
// }
app.post("/sessions", async function(req, res){


  const subjectsIds = req.body.selectedSubjectsIds
  try {
    const newSession = await db.session.create(req.body.session)
    const sessionSubjects = await addSubjectsToSession(newSession.dataValues.id, subjectsIds)

    const sessionUsers = await db.session_users.create({
      userId: req.body.session.createdByUserId,
      sessionId: newSession.dataValues.id,
      role: req.body.session.role,
      status: 'Host'
    })

    const mentors = await findMentorsBySubjectsIds(subjectsIds)
    const session = await db.session.findOne({
      where: {
        id: newSession.dataValues.id,
      },
      include: [
        {
          model: db.user,
          // through: {
          //   attributes: ['createdAt', 'startedAt', 'finishedAt'],
          //   where: {completed: true}
          // }
          },
        {
          model: db.subject
        },
      ]
    })

    res.send({session, mentors})
  }
  catch (err) {
    throw err
    res.send(err)
  }
  
 });

app.get("/sessions/:id", async function(req, res){
 
  // const subjectsIds = req.body.selectedSubjectsIds
  try {
    // create offer 
    const session = await db.session.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.user,
          // through: {
          //   attributes: ['createdAt', 'startedAt', 'finishedAt'],
          //   where: {completed: true}
          // }
          },
        {
          model: db.subject
        },
      ]
    })

    res.send(session)
  }
  catch (err) {
    throw err
    res.send(err)
  }
  
 });
app.post("/sessions/:id/apply", async function(req, res){
  const session = req.body.session;
  // const subjectsIds = req.body.selectedSubjectsIds
  try {
    // create offer 
    const offer = await db.offer.create(req.body.offer)
    console.log('offer', offer)
    // add user to sessionUsers
    const sessionUser = await db.session_users.create(req.body.sessionUser)
    let message = {...req.body.message}
    message.offerId = offer.dataValues.id
    const messages = await messagesController.createMessagesFunction([message])
    res.send({
      offer,
      sessionUser,
      messages
    })
  }
  catch (err) {
    res.send(err)
  }
  
 });
app.put("/sessions/:id/status", async function(req, res){
  const session = req.body.session;
  // const subjectsIds = req.body.selectedSubjectsIds
  try {
    const updatedSession = await db.session.update({ 
      status: req.body.status
    }, {
      where: {
        id: req.body.id
      },
      // returning: true, // needed for affectedRows to be populated
      // plain: true // makes sure that the returned instances are just plain objects
    })
    res.send(updatedSession)
  }
  catch (err) {
    res.send(err)
  }
  
 });


 app.post("/session-users", async function(req, res){
 
  try {
    const sessionUsers = await db.session_users.create({
      userId: req.body.userId,
      sessionId: req.body.sessionId,
      role: req.body.role,
      status: req.body.status
    })
    res.send(sessionUsers)
  }
  catch (err) {
    res.send(err)
  }
  
 });

app.put("/session-users", async function(req, res){
  
  
  try {
    // const sessionUsers = await db.session_users.create({
    //   userId: req.body.userId,
    //   sessionId: req.body.sessionId,
    //   role: req.body.role,
    //   status: req.body.status
    // })
    const sessionUsers = await db.session_users.update({ 
      status: req.body.status
    }, {
      where: {
        sessionId: req.body.sessionId,
        userId: req.body.userId
      },
      // returning: true, // needed for affectedRows to be populated
      // plain: true // makes sure that the returned instances are just plain objects
    })

    res.send(sessionUsers)
  }
  catch (err) {
    res.send(err)
  }
  
 });

app.post("/session-users/:sessionId/remove", async function(req, res){

  try {
    await db.session_users.destory({
      where: {
        userId: req.body.userId,
        sessionId: req.body.id
        },
      force: true
    }).then(deleted => {

      res.send(deleted)

    })
  }
  catch (err) {
    res.send(err)
  }
  
 });

const findMentorsBySubjectsIds = (subjectsIds) => {
  console.log('subjectsIds', subjectsIds)
   return new Promise((reslove, reject) => {
    try {
      db.user_subjects.findAll({
        where: {
          subjectId: subjectsIds
        },
        // include: [
        //   {
        //   model: db.user,
        //   },
        // ]

      }).then(users => {
        
        const userIds = users.map(user => user.dataValues.userId)
        db.user.findAll({
          where: {
            id : userIds,
            type: 'mentor'
          }
        }).then(mentors => {
          reslove(mentors)

        })
      
      })
      
    }
    catch (err) {
      reject(err)
    }
   })
}

 const createSessionMessages = (session) => {

 }

 const addSubjectsToSession = (sessionId, subjectIds) => {

  const promises = subjectIds.map(subjectId => addSubjectToSession(sessionId, subjectId))
  return Promise.all(promises)
 }

 const addSubjectToSession = (sessionId, subjectId) => {

  return new Promise((resolve, reject) => {
    try {
      db.session_subjects.create({
        sessionId: sessionId,
        subjectId: subjectId,
        
      }).then(result => {
        resolve(result)
      })

    } catch (err) {
      reject(err)
    }
  })
 }
