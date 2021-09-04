;(function() {

  /**
   * App configuration inluding MongoDB, API route etc.
   */

  'use strict';

  module.exports = {
    db: {
      development: {
        url: 'remotemysql.com/apidev',
        port: 5000
      },
      test: {
        url: 'remotemysql.com/apitest',
        port: 5555
      },
      production: {
        url: 'remotemysql.com/apiprod',
        port: 5300
      },
    },
    baseUrl: 'http://localhost:9999/',
    secret: 'customSecret2016?!', // BEWARE: this should not goes into repository
    apiRoute: '/api/v1/',
    HOST:'remotemysql.com',
    USER: 'BzPDMGFb9s',
    PASSWORD: 'YMbEUZBEt0',
    DB: `BzPDMGFb9s`,
    dialect: 'mysql',
    pool: {
      max: 10000000,
      min: 0,
      acquire: 30000,
      idle: 30000,
      connectionLimit: 1000000,
      max_user_connections: 1000000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
      multipleStatements: true,
    },
    zoomApi: {
      apiKey: '7IdAbO7-Snqj55K1gASFIg',
      secret: 'vIgsRGRTCLAO5KrsZMOcSMwVnG9wAWGQPvTd',
      zoomMainJwtToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IjdJZEFiTzctU25xajU1SzFnQVNGSWciLCJleHAiOjE2MDM0MzU1NTIsImlhdCI6MTYwMjgzMDc1Mn0.-BJ-XP1ZTw4GGDUlaRszAbpUWcJ2LvIaXHXwcMa9fs4'
    }
  };

})();
