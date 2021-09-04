/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const http = require("http");
const logger = require('./logger');
const cors = require('cors');
const argv = require('./argv');
const port = require('./port');
const config = require('./config.js');
const bodyParser = require('body-parser');
const models = require("./models");
const setup = require('./middlewares/frontendMiddleware');
const app = express();
const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const isDev = process.env.NODE_ENV !== 'production';


const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');


// models.sequelize.sync({force: true});
app.use(bodyParser.json())
// If you need a backend, e.g. an API, add your custom backend-specific middleware here


const routes = require('./routes')

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(config.apiRoute, routes);
// In production we need to pass these values in instead of relying on webpack
// setup(app, {
//   outputPath: resolve(process.cwd(), 'build'),
//   publicPath: '/',
// });

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});



const users = {};
const sessions = {}
io.on('connection', socket => {
  console.log('CONNECTIONNNNNNN')
    if (!users[socket.id]) {
        users[socket.id] = {
          socketId: socket.id
        };
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
    socket.on('disconnect', () => {
      console.log('disconnect', socket.id)

        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        // console.log('call created', data)
        console.log('call created', data.userToCall)
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
    socket.on("declineCall", (data) => {
        console.log('declineCall', data)
        io.to(data.to).emit('callDeclined', data.from);
    })
    socket.on("sessionJoined", (data) => {
        
        console.log('sessionJoined data', data)
        console.log('sessionJoined', users)
        // console.log('sessionJoined', sessions[data.sessionId])

        const roomName = `session_${data.sessionId}`
        socket.join(roomName);

        
        users[data.socketId].fullName = data.fullName
        users[data.socketId].userId = data.userId
        users[data.socketId].sessionId = data.sessionId
        const clients = io.sockets.adapter.rooms
        console.log('clients', clients)
        console.log('users', users)
        let sessionUsers = []
        Object.keys(users).map(socketId => {
          users[socketId].sessionId == data.sessionId && sessionUsers.push(users[socketId])
        })
        io.to(`session_${data.sessionId}`).emit("sessionJoinedConfirmed", sessionUsers);
        // users[data.socketId].session = data.sessionId

        // if (!sessions[data.sessionId]) {
        //   sessions[data.sessionId] = {
        //     users: [{
        //       userId: data.userId,
        //       socketId: data.socketId,
        //       fullName: data.fullName
        //     }]
        //   }
        // } else {
        //   // console.log(sessions[data.sessionId])
        //   const connectedUserIds = sessions[data.sessionId].users.map(user => user.userId)
        //   console.log('connectedUserIds', connectedUserIds)
        //   if (!connectedUserIds.includes(data.userId)) sessions[data.sessionId].users.push({
        //     userId: data.userId,
        //     fullName: data.fullName,
        //     socketId: data.socketId,
        //   })
          
        // }
        // io.to(`session_${data.sessionId}`).emit("sessionJoinedConfirmed", sessions[data.sessionId].users);

    })
    socket.on("leaveSession", (data) => {
        
        console.log('leaveSession user', data)
        console.log('leaveSession', users)
        console.log('leaveSession', sessions[data.sessionId])
        try{
          // console.log('[socket]','leave room :', room);
          socket.leave(`session_${data.sessionId}`);
          socket.to(`session_${data.sessionId}`).emit('user left', data);
        }catch(e){
          console.log('[error]','leave room :', e);
          socket.emit('error','couldnt perform requested action');
        }

    })
});
// Start your app.
// server.listen(8000, () => console.log('server is running on port 8000'));
server.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
