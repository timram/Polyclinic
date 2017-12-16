const config = require('./config');

const knex = require('knex')({
  client: 'pg',
  debug: false,
  pool: {
    backoff: {
      min: 10,
      max: 10000
    }
  },
  connection: {
    host: config.pgHost,
    user: config.pgUser,
    password: config.pgPassword,
    database: config.pgDatabase
  }
});

module.exports = knex;
