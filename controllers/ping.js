const { ErrorHandler } = require('../helpers');

async function success(req, res) {
  try {
    console.log(gasdf);

    return res.json({
      staus: 'OK'
    });
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getPing(req, res) {
  try {
    return res.json({
      id: req.params.pingID
    });
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  success,
  getPing
};
