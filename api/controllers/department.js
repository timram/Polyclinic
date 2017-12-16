const { ErrorHandler } = require('../helpers');

async function getAllDepartments(req, res) {
  try {
    return res.json('all departments');
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  getAllDepartments
};
