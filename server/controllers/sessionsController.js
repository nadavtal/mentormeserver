const fs = require("fs");
const config = require('../config.js')
const db = require('../models/index')
const jwt = require('jsonwebtoken');
const Sequelize = require("sequelize");
const {or, and, gt, lt} = Sequelize.Op;


const getNumAccurances = (array, item) => {
  let accurances = []

  array.forEach(element => {
    if (element == item) {
      accurances.push(element)
    } 
  })

  return accurances.length
}
const getSessions = async (req, res) => {

  const sessions = await getSessionsFunction(req.query);
  res.send(sessions)

}

const getSessionsFunction = async (query) => {
  if (query.subjectIds) {
    try {
      const subjectsIds = query.subjectIds.split(',');
      const usersSubjects = await db.user_subjects.findAll({
        where: {
          // subjectId: subjectsId,
          [and]: [
            {subjectId: subjectsIds},
            
          ]
        }
      })
      const userIds = usersSubjects.map(userSubject => userSubject.dataValues.userId);
      const mentors = await db.user.findAll({
        where: {
          type :'Mentor',
          id: userIds
        },
        include: [
          {
          model: db.subject,
          where: {
            id: subjectsIds
          } 
          },
          {
          model: db.job
          }
        ]
      })

      const mentorsWithAllSubjects = mentors.filter(mentor => mentor.dataValues.subjects.length == subjectsIds.length )

      return mentorsWithAllSubjects
    } catch (err) {
      throw err
    }
    
  } 
  else if (query.fieldName) {

    try {
      const field = await db.field.findOne({
        where: {
          name: query.fieldName
        },
        include: [
          {
            model: db.job,
            include: [
              {
                model: db.subject,
                include: [
                  {
                    model: db.session,
                    include: [
                      {
                      model: db.subject, 
                      include: [
                        {
                        model: db.job, 
                        }
                      ]
                      },
                      {
                      model: db.user, 
                      attributes: ['full_name'],
                      },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
      let sessions = []
      let sessionsIds = []
      field.jobs.forEach(job => {
        job.subjects.forEach(subject => {
          subject.sessions.forEach(session => {
            if (!sessionsIds.includes(session.id)) {
              // session.dataValues.jobs = []
              sessions.push(session);
              sessionsIds.push(session.id);
            } 
            // else {
            //   const existingSession = sessions.find(sess => sess.id == session.id)
            //   console.log('existingSession', existingSession)
            //   !existingSession.jobs.includes(job) && existingSession.jobs.push(job)
            // }
          })
        })
      })
      return sessions
    } catch (err) {
      throw err
    }
   
  }
  else {
    try {
      const allSessions = await db.session.findAll({
        include: [
          {
          model: db.subject, 
          },
          {
          model: db.user, 
          },
        ]
      })
      // console.log(mentors)
      return allSessions
    } catch (err) {
      throw err
    }
    

  }
}


module.exports = {
  getSessions,
  getSessionsFunction
};