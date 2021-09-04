const fs = require("fs");
const config = require('../config.js')
const db = require('../models/index')
const jwt = require('jsonwebtoken');
const zoomApi = config.zoomApi
const zoomApiBaseUrl = 'https://api.zoom.us/v2/';
const axios = require('axios')
const http = require("https");

const getUsers = async (req, res) => {

    const user = await getUser();
    res.send(user)
}

const getUser = async () => {
  return new Promise((resolve, reject) => {
    const url = zoomApiBaseUrl + 'users'
    var options = {
      "method": "GET",
      "hostname": "api.zoom.us",
      "port": null,
      "path": "/v2/users",
      "headers": {
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IjdJZEFiTzctU25xajU1SzFnQVNGSWciLCJleHAiOjE2MDM0MzU1NTIsImlhdCI6MTYwMjgzMDc1Mn0.-BJ-XP1ZTw4GGDUlaRszAbpUWcJ2LvIaXHXwcMa9fs4",
        "cache-control": "no-cache",
        
      }
    };
    axios(url, options)
      .then(function(response) {

        resolve(response.data) ;
      })
      .catch(function(err) {
        // API call failed...
        console.log('API call failed, reason ', err);
        reject(err);
      });
  })

}
const createMeeting = async (req, res) => {  

  var options = {
    method: 'POST',
    hostname: 'api.zoom.us',
    port: null,
    path: '/v2/users/y9wg0LvdQ7yo1MMau0kdcw/meetings',
    headers: {
      'content-type': 'application/json',
      authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IjdJZEFiTzctU25xajU1SzFnQVNGSWciLCJleHAiOjE2MDM0MzU1NTIsImlhdCI6MTYwMjgzMDc1Mn0.-BJ-XP1ZTw4GGDUlaRszAbpUWcJ2LvIaXHXwcMa9fs4',
    },
  };

  var request = http.request(options, function (response) {
    var chunks = [];

    response.on("data", function (chunk) {
      chunks.push(chunk);
    });

    response.on("end", function () {
      var body = Buffer.concat(chunks);
      res.send(body.toString())
    });
  });
  const requesBody = {
    topic: 'Nadu new meeting',
    type: 'integer',
    start_time: 'string [date-time]',
    duration: 'integer',
    schedule_for: 'string',
    timezone: 'string',
    password: 'string',
    agenda: 'string',
    recurrence: {
      type: 'integer',
      repeat_interval: 'integer',
      weekly_days: 'string',
      monthly_day: 'integer',
      monthly_week: 'integer',
      monthly_week_day: 'integer',
      end_times: 'integer',
      end_date_time: 'string [date-time]'
    },
    settings: {
      host_video: 'boolean',
      participant_video: 'boolean',
      cn_meeting: 'boolean',
      in_meeting: 'boolean',
      join_before_host: 'boolean',
      mute_upon_entry: 'boolean',
      watermark: 'boolean',
      use_pmi: 'boolean',
      approval_type: 'integer',
      registration_type: 'integer',
      audio: 'string',
      auto_recording: 'string',
      enforce_login: 'boolean',
      enforce_login_domains: 'string',
      alternative_hosts: 'string',
      global_dial_in_countries: ['string'],
      registrants_email_notification: 'boolean'
    }
  }
  request.write(JSON.stringify(req.body));
  request.end();
}

module.exports = {
    getUsers,
    createMeeting,
    getUser
};