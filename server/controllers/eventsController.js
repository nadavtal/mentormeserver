const fs = require("fs");
const config = require('../config.js')
const db = require("../models");
const jwt = require('jsonwebtoken');

const connection = require('../db.js');
const Event = db.event
const EventCategory = db.eventCategory

const createEvent = async (req, res) => {
  // console.log(req.body)
  const event = req.body.event
  const categories = req.body.cats
  try {
    Event.create({
      name: event.name,
      description: event.description,
      language: event.language,
      start: event.start,
      hostId: event.hostId
    }).then(event => {

        Promise.all(categories.map(category => {

          return EventCategory.create({
            eventId: event.dataValues.id,
            categoryId: category.id
          })
          // try {
          //   EventCategory.create({
          //     eventId: event.dataValues.id,
          //     categoryId: category.id
          //   })

          // } catch (e) {
          //   console.log('Error when trying creating event category', e)
          // }
        }))
        .then(results => {

          return res.send(event);
        })
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying creating user: ${error}`);
  }
};
const getEventsByHostId = async (req, res) => {
  // console.log(req.body)

  try {
    Event.findAll({
      where: {
        hostId: req.params.id
      }
    })
     .then(results => {
        // console.log('results', results)
        return res.send(results);
      })
    
  } catch (error) {

    return res.send(`Error when trying getting user events: ${error}`);
  }
};


module.exports = {
  createEvent,
  getEventsByHostId
};