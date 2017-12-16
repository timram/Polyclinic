const { ErrorHandler } = require('../helpers');
const { PingService } = require('../services');

async function getPing(req, res) {
  try {
    const { pingID } = req.params;
    console.log(req.user);
    const returnedPingID = await PingService.getPingID(pingID);

    return res.json(returnedPingID);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  getPing
};
