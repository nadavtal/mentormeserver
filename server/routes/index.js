var userRoutes = require('./users');
var authRoutes = require('./auth');
var appDataRoutes = require('./appData');
var eventsRoutes = require('./events');
var fieldsRoutes = require('./fields');
var jobsRoutes = require('./jobs');
var subjectsRoutes = require('./subjects');
var resourcesRoutes = require('./resources');
var sessionsRoutes = require('./sessions');
var messagesRoutes = require('./messages');
var mentorsRoutes = require('./mentors');
var zoomApiRoutes = require('./zoomApi');
var skillsRoutes = require('./skills');
var articlesRoutes = require('./articles');


const routes = [userRoutes, appDataRoutes, authRoutes, eventsRoutes, fieldsRoutes,
    jobsRoutes, subjectsRoutes, resourcesRoutes,sessionsRoutes,
    messagesRoutes, mentorsRoutes, zoomApiRoutes, skillsRoutes, articlesRoutes
  ]
module.exports = routes