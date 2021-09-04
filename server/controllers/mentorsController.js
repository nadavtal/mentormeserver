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
const getMentors = async (req, res) => {

    console.log(req.query.subjectIds)
    if (req.query.subjectIds) {
      try {
        const subjectsIds = req.query.subjectIds.split(',');
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
            include: [
              {
                model: db.job,
                include: [
                  {
                    model: db.field
                  }
                ]
              }
            ]
            // where: {
            //   id: subjectsIds
            // } 
            },
            {
            model: db.job
            },
            {
            model: db.skill
            }
          ]
        })

        const mentorsWithAllSubjects = mentors.filter(mentor => {
          const mentorSubjectIds = mentor.dataValues.subjects.map(sub => sub.id)
          console.log('mentorSubjectIds', mentorSubjectIds)
        } )
  
        res.send(mentors)
      } catch (err) {
        throw err
      }
      
    } 
    else if (req.query.fieldName) {

      try {
        const field = await db.field.findOne({
          where: {
            name: req.query.fieldName
          },
          include: [
            {
              model: db.job,
              include: [
                {
                  model: db.subject,
                  include: [
                    {
                      model: db.user,
                      where: {
                        type: 'Mentor'
                      },
                      include: [
                        {
                        model: db.subject,
                        include: [
                          {
                            model: db.job,
                            include: [
                              {
                                model: db.field
                              }
                            ]
                          }
                        ] 
                        },
                        {
                        model: db.field, 
                        },
                        {
                        model: db.job
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        })
        let mentors = []
        let userIds = []
        field.jobs.forEach(job => {
          job.subjects.forEach(subject => {
            subject.users.forEach(user => {
              if (!userIds.includes(user.id)) {
                mentors.push(user);
                userIds.push(user.id);
              }
            })
          })
        })
        res.send(mentors)
      } catch (err) {
        throw err
      }
     
    }
    else {
      try {
        const allMentors = await db.user.findAll({
          where: {
            type :'Mentor'
          },
          include: [
            {
            model: db.subject, 
            include: [
              {
                model: db.job,
                include: [
                  {
                    model: db.field
                  }
                ]
              }
            ]
            },
            {
            model: db.field, 
            },
            {
            model: db.job
            }
          ]
        })
        // console.log(mentors)
        res.send(allMentors)
      } catch (err) {
        throw err
      }
      

    }

}


module.exports = {
  getMentors
};