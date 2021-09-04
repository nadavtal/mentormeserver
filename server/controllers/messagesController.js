const fs = require("fs");
const config = require('../config.js')
const db = require('../models/index')
const jwt = require('jsonwebtoken');
const { resolve } = require("path");
const { reject } = require("lodash");
const { message } = require("../models/index");
// const User = db.user

// const createMessage = (message) => {

//   console.log('creating Message')
//   try {
//     db.message.create(message).then(createdMsg => {
//       console.log('Message', createdMsg);
      
//        return createdMsg;
//     });
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

const createMessages = async (req, res) => {
  console.log('createMessages'), req.body
  const messages = JSON.parse(req.body.messages);
  // console.log(messages)
  try {
    // Promise.all(messages.map(message => createMessage(message)))
    //   .then(messagesCreated => {
    //     console.log('messagesCreated', messagesCreated)
    //     res.send(messagesCreated)

    //   })
      const messagesResponse = await db.message.bulkCreate(messages, {
        returning: true
      })
      res.send(messagesResponse)
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying create message: ${error}`);
  }
};

const createMessagesFunction = async (messages) => {
  const result = await db.message.bulkCreate(messages, {
    returning: true
  })

  // return Promise.all(messages.map(message => createMessage(message)))
}
const createMessage = (message) => {
  return new Promise((resolve, reject) => {
    try {
      db.message.create(message)
        .then(createdMessage => resolve(createdMessage))

    } catch (err) {
      reject(err)
    }
  })
}

const updateMessageStatus = async (req, res) => {
 
  
  try {
    const message = await db.message.update({ 
      read: req.body.read
    }, {
      where: {
        id: req.params.id,       
      },
      // returning: true, // needed for affectedRows to be populated
      // plain: true // makes sure that the returned instances are just plain objects
    })
    // console.log(numberOfAffectedRows) // say we had 3 pugs with the age of 7. This will then be 3
    // console.log(affectedRows) // this will be an array of the three affected pugs

    res.send(message)
  }
  catch (err) {
    res.send(err)
  }
}

const getMessage = async (req,res) => {
  try {
    const message = await db.message.findOne({
      where: {
        id: req.params.id,        
      },
      include: [
        {model: db.offer}
      ]
    })
    const sender = await db.user.findOne({
      where: {
        id: message.dataValues.fromUserId
      },
      attributes: ['full_name', 'email', 'id', 'rank']
    })

    // .then(message => {
    message.dataValues['sender'] = sender.dataValues
    if (message.dataValues.sessionId) {
      
      const session = await db.session.findOne({
        where: {
          id: message.dataValues.sessionId
        },
        include: [
          {
          model: db.user,   
          attributes: ['full_name', 'email', 'id', 'image', 'type'],
          include: [
              {
                model: db.offer
              }
            ]
          },
          {
          model: db.subject,
          },
          
        ]
      })
      message.dataValues.session = session
    }

    res.send(message);
    } catch (error) {
      // console.log(error);
      res.send(error);
    }
}
const getUserMessages = async (req,res) => {
  try {
    const messages = await getUserMessagesFunction(req.params.userId)
    res.send(messages)
    } catch (error) {

      res.send(error);
    }
}
const getUserMessagesFunction = async (userId) => {

  try {
    const messages = await db.message.findAll({
      include: [
        {
          model: db.offer
        }
      ],
      where: {
        toUserId: userId,        
      }
    })
    // console.log('messages', messages)
    const senderIds = messages.map(message => message.dataValues.fromUserId)

    const messagesSenders = await db.user.findAll({
      include: {
        model: db.subject
      },
      where: {
        id: senderIds
      },

      attributes: ['full_name', 'email', 'id']
    })
    // messages = [...messages.map(msg => msg.dataValues)]
    messages.forEach(msg =>  {

      const sender = messagesSenders.find(sender => sender.dataValues.id == msg.fromUserId)
      msg.dataValues['sender'] = sender
      // msg.dataValues['senderName'] = sender.full_name
      // msg.dataValues['senderEmail'] = sender.email
    })

    return messages
    } catch (error) {
      throw error;
      return error;
    }

}
module.exports = {
  createMessage,
  createMessages,
  createMessagesFunction,
  getUserMessages,
  getMessage,
  updateMessageStatus
};