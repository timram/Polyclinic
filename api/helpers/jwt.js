const jwt = require('jsonwebtoken');
const config = require('../config');

function generate({ id }) {
  return jwt.sign({ id }, config.jwtSecret);
}

function verify(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = {
  generate,
  verify
};
