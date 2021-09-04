
const config = require('../config.js')
const db = require('../models/index')
const jwt = require('jsonwebtoken');
const zoomController = require('./zoomController')
const User = db.user
// const User = db.user
// console.log('DB', db)
const createUser = async (req, res) => {

  const user = await createUserPromise(req.body)
  // console.log(user)
  res.send(user)
};
const createUserPromise = async (req) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ 
      email: req.email, 
      password: req.password, 
      type: req.type,
      expiresIn: '2 days'
    }, config.secret);
  
    const user = {
      full_name: req.full_name,
      email: req.email,
      password: req.password,
      image: '',
      token: token,
      balance: 0,
      status: req.status,
      type: req.type,
      language: req.language
    }
    try {
      db.user.create(user).then(newUser => {
        // console.log('newUser', newUser);
        
         resolve({user: newUser, role: newUser.type})
      });
    } catch (error) {
      reject(error);
      
    }

  })
};

const getUser = async (req, res) => {
  const user = await getUserFunction(req.params.id)
  res.send(user)
};

const getUserFunction = async (userID) => {

  try {
    User.findOne({
      where: {
        id: userID
     }
    }).then(user => {
      
      
       return user;
    });
  } catch (error) {
    // console.log(error);
    return error
  }
}
const getUsersFunction = async (userIDs) => {
  
  try {
    User.findAll({
      where: {
        id: userIDs
     }
    }).then(users => {
     
      
       return users;
    });
  } catch (error) {
  
    return error
  }
}
const getUserData = async (req, res) => {

  try {
    const data = await db.user.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        'followers',
        {
          model: db.field,
        },
        {
          model: db.job,
        },
        {
          model: db.session,
          include: [
            {
              model: db.subject,
              include: [
                {
                  model: db.field,
                },
                {
                  model: db.job,
                },
              ],
            },
          ],
        },
        {
          model: db.subject,
          include: [
            {
              model: db.field,
            },
          ],
        },
        {
          model: db.article,
        },
        {
          model: db.skill,
          include: [
            {
              model: db.subject,
            },
          ],
        },
        {
          model: db.session,
        },
      ],
    });
    const userMessages = await getUnreadMessagesSentToUserId(req.params.id)    
    data.dataValues.unreadMessages = userMessages
    const followees = await db.user_followers.findAll({
      where: {
        followerId: req.params.id,
      }
    })
    data.dataValues.followees = followees
    res.send(data)
  } catch (err) {
    throw err
  }

}
const getUserBasicData = async (req, res) => {

  try {
    const data = await db.user.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        "followers",
        
        // {
        //   model: db.user_followers,
        //   attributes: ['full_name', 'email', 'id', 'rank']
        // },
        {
          model: db.field,
        },
        {
          model: db.job,
        },
        {
          model: db.session,
          include: [
            {
              model: db.subject,
              include: [
                {
                  model: db.field,
                },
                {
                  model: db.job,
                }
              ]
            }
          ]
        },
        {
          model: db.subject,
        },
        {
          model: db.article,
        },
        {
          model: db.skill,
        },
        // {
        //   model: db.session,
        // },
      ],
    });
    res.send(data)
  } catch (err) {
    throw err
  }

}

const getUserFields = async (req, res) => {
  try {
    // const fieldsIdsAndStatuses = await db.user_fields.findAll({
    //   where: {
    //     userId: req.params.id,
    //   }
    // }).then(connections => {
    //   const idsAndStatuses = connections.map(connection => {
    //     return {
    //       id :connection.dataValues.fieldId,
    //       status: connection.dataValues.status
    //     }
    //   })
    //   return idsAndStatuses
    // })
    // // console.log(fieldsIdsAndStatuses)
    // const fieldsIds = fieldsIdsAndStatuses.map(item => item.id);
    // // console.log(fieldsIds)
    // let fields = await db.field.findAll({
    //   where: {
    //     id: fieldsIds // Same as using `id: { [Op.in]: [1,2,3] }`
    //   }
    // }).then(results => {
    //   results = results.map(result => result.dataValues)
    //   return results
    // });
    // console.log('fields', fields)

    // fields.forEach(field => {
    //   // console.log(field)
    //   // console.log(fieldsIdsAndStatuses.find(item => item.id == field.id))
    //   field['status'] = fieldsIdsAndStatuses.find(item => item.id == field.id).status
    // });

    // console.log('fieldsWithStatuses', fields)
    const fields = await getUserFieldsFunction(req.params.id)
    res.send(fields)
    } catch (error) {
      // console.log(error);
      res.send(error);
    }

}
const getUserFieldsFunction = async (userId) => {
 
  try {
    const fieldsIdsAndStatuses = await db.user_fields.findAll({
      where: {
        userId: userId,
      }
    }).then(connections => {
      const idsAndStatuses = connections.map(connection => {
        return {
          id :connection.dataValues.fieldId,
          status: connection.dataValues.status
        }
      })
      return idsAndStatuses
    })
    // console.log(fieldsIdsAndStatuses)
    const fieldsIds = fieldsIdsAndStatuses.map(item => item.id);
    // console.log(fieldsIds)
    let fields = await db.field.findAll({
      where: {
        id: fieldsIds // Same as using `id: { [Op.in]: [1,2,3] }`
      }
    }).then(results => {
      results = results.map(result => result.dataValues)
      return results
    });
    // console.log('fields', fields)

    fields.forEach(field => {
      
      field['status'] = fieldsIdsAndStatuses.find(item => item.id == field.id).status
    });

   
    return fields
    } catch (error) {
      // console.log(error);
      return error;
    }

}
const getUserSessions = async (req, res) => {
  try {

    const sessions = await getUserSessionsFunction(req.params.id)

    res.send(sessions)
    } catch (error) {
      // console.log(error);
      res.send(error);
    }

}
const getUserSessionsFunction = async (userId) => {
 
  try {
    const data = await db.user.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: db.session,
          include: [
            {
              model: db.subject,
    
            },
          ],

        },
      ],
    });

    return data.sessions
    } catch (error) {
      // console.log(error);
      return error;
    }

}

const getUnreadMessagesSentToUserId = async (userId) => {
  
  try {
    const messages = await db.message.findAll({
      where: {
        toUserId: userId,
        read: false
      }
    })
   
    return messages
    } catch (error) {
      
      return error;
    }
}
const getUserMessagesFunction = async (userId, status, ) => {
  
  try {
    const messages = await db.message.findAll({
      where: {
        toUserId: userId,
        status: status
      }
    })
    
    return messages
    } catch (error) {
     
      return error;
    }

}

const getUserJobs = async (req, res) => {
 
  try {
    // const jobIds = await db.user_jobs.findAll({
    //   where: {
    //     userId: req.params.id,
    //   }
    // }).then(connections => {

    //   const ids = connections.map(connection => connection.dataValues.jobId)
    //   return ids
    // })

    // const jobs = await db.job.findAll({
    //   where: {
    //     id: jobIds // Same as using `id: { [Op.in]: [1,2,3] }`
    //   }
    // });
    const jobs = await getUserJobsFunction(req.params.id)
    res.send(jobs)
  } catch (error) {
    // console.log(error);
    res.send(error);
  }

}

const getUserJobsFunction = async (userId) => {
  // console.log('getting user jobs', req.params)
  try {
    const jobIdsAndStatuses = await db.user_jobs.findAll({
      where: {
        userId: userId,
      }
    }).then(connections => {
      // console.log(connections)
      const ids = connections.map(connection => {
        return {
          id :connection.dataValues.jobId,
          status: connection.dataValues.status
        }
      })
      return ids
    })
    const jobIds = jobIdsAndStatuses.map(item => item.id);

    const jobs = await db.job.findAll({
      where: {
        id: jobIds // Same as using `id: { [Op.in]: [1,2,3] }`
      }
    }).then(results => {
      results = results.map(result => result.dataValues)
      return results
    });
    jobs.forEach(job => {
      // console.log(field)
      // console.log(fieldsIdsAndStatuses.find(item => item.id == field.id))
      job['status'] = jobIdsAndStatuses.find(item => item.id == job.id).status
    });
    return jobs
  } catch (error) {
    // console.log(error);
    return error;
  }

}

const getUserSkills = async (req, res) => {
  // console.log('getting user subjects', req.params)
  try {
    // const subjectIds = await db.user_subjects.findAll({
    //   where: {
    //     userId: req.params.id,
    //   }
    // }).then(connections => {
    //   // console.log(connections)
    //   const ids = connections.map(connection => connection.dataValues.subjectId)
    //   return ids
    // })
    // // console.log('subjectIds: ', subjectIds)
    // const subjects = await db.subject.findAll({
    //   where: {
    //     id: subjectIds // Same as using `id: { [Op.in]: [1,2,3] }`
    //   }
    // });
    const skills = await db.skill.findAll({
      where: {
        id: req.params.id // Same as using `id: { [Op.in]: [1,2,3] }`
      }
    });
    res.send(skills)
  } catch (error) {
    // console.log(error);
    res.send(error);
  }

}
const getUserSubjects = async (req, res) => {
  // console.log('getting user subjects', req.params)
  try {
    // const subjectIds = await db.user_subjects.findAll({
    //   where: {
    //     userId: req.params.id,
    //   }
    // }).then(connections => {
    //   // console.log(connections)
    //   const ids = connections.map(connection => connection.dataValues.subjectId)
    //   return ids
    // })
    // // console.log('subjectIds: ', subjectIds)
    // const subjects = await db.subject.findAll({
    //   where: {
    //     id: subjectIds // Same as using `id: { [Op.in]: [1,2,3] }`
    //   }
    // });
    const subjects = await getUserSubjectsFunction(req.params.id)
    res.send(subjects)
  } catch (error) {
    // console.log(error);
    res.send(error);
  }

}
const getUserSubjectsFunction = async (userId) => {

  try {
    const subjectIds = await db.user_subjects.findAll({
      where: {
        userId: userId,
      }
    }).then(connections => {
      // console.log(connections)
      const ids = connections.map(connection => connection.dataValues.subjectId)
      return ids
    })

    const subjects = await db.subject.findAll({
      where: {
        id: subjectIds // Same as using `id: { [Op.in]: [1,2,3] }`
      }
    });
    return subjects
  } catch (error) {
 
    return error;
  }

}
const changeSubjectPrice = async (req, res) => {
  
  try {
    const userSubject = await db.user_subjects.update(req.body, {
      where: {
        userId: req.params.id,       
        subjectId: req.params.subjectId,       
      },
      // returning: true, // needed for affectedRows to be populated
      plain: true // makes sure that the returned instances are just plain objects
    })
    res.send(userSubject)
  }
  catch (err) {
    res.send(err)
  }
}
const changeSkillPrice = async (req, res) => {
  
  try {
    const userSkill = await db.user_skills.update(req.body, {
      where: {
        userId: req.params.id,       
        skillId: req.params.skillId,       
      },
      // returning: true, // needed for affectedRows to be populated
      plain: true // makes sure that the returned instances are just plain objects
    })
    res.send(userSkill)
  }
  catch (err) {
    res.send(err)
  }
}
const followUser = async (req, res) => {
  
  try {
    const userFollow = await db.user_followers.create({
      userId: req.params.userId,
      followerId: req.params.id
    })
      
    res.send(userFollow)
  }
  catch (err) {
    res.send(err)
  }
}
const updateFollowUserStatus = async (req, res) => {
  // console.log(req.body)
  try {
    const userFollow = await db.user_followers.update(req.body, {
      where: {
        userId: req.params.userId,
        followerId: req.params.id
      },
      // returning: true, // needed for affectedRows to be populated
      // plain: true // makes sure that the returned instances are just plain objectsz
    })
    res.send(userFollow)
  }
  catch (err) {
    res.send(err)
  }
}

const updateUserSkills = async (req, res) => {
  console.log(req.body)
  try {
    const updated = await db.user_skills.update({ [`${req.body.field}`] : req.body.value },{ where : { skillId : req.body.ids , userId: req.params.id}}); 
    console.log(updated)
    res.send(updated)
  } catch (err) {
    res.send(err)
  }
}

module.exports = {
  createUser,
  getUser,
  getUserFields,
  getUserJobs,
  getUserSubjects,
  getUserData,
  changeSubjectPrice,
  changeSkillPrice,
  createUserPromise,
  getUserSessions,
  getUserSkills,
  getUserBasicData,
  followUser,
  updateFollowUserStatus,
  updateUserSkills
};