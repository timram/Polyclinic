const JWT = require('./jwt');
const ErrorHandler = require('./error-handler');
const knex = require('../knex');

async function authorize(req, res, next) {
  try {
    if (req.headers.auth_token && req.headers.auth_token.length > 0) {
      const accountID = JWT.verify(req.headers.auth_token);

      const [account] = await knex('account')
        .select('id', 'fname', 'lname', 'email', 'phone', 'role')
        .where('id', accountID);

      if (!account) {
        const error = new Error('Not authorized access!');
        error.status = 400;
        throw error;
      }

      req.account = account;

      next();
    }

    const error = new Error('Not authorized access!');
    error.status = 400;
    throw error;
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = authorize;
