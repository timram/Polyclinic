const { AccountService } = require('../services');
const { ErrorHandler } = require('../helpers');

function throwNotAuthorizedError() {
  const error = new Error('Not authorized access');
  error.status = 400;
  throw error;
}

async function getAllPatients(req, res) {
  try {
    console.log(req.account);

    if (req.account.role !== 'doctor') {
      throwNotAuthorizedError();
    }

    const patients = await AccountService.getAllPatients();

    return res.json(patients);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getAllDoctors(req, res) {
  try {
    const doctors = await AccountService.getAllDoctors();

    return res.json(doctors);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getPatient(req, res) {
  try {
    const accountID = parseFloat(req.params.accountID);

    if (accountID !== req.account.id && req.account.role !== 'doctor') {
      throwNotAuthorizedError();
    }

    const patient = await AccountService.getPatient(accountID);

    return res.json(patient);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getDoctor(req, res) {
  try {
    const accountID = parseFloat(req.params.accountID);

    const doctor = await AccountService.getDoctor(accountID);

    return res.json(doctor);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function updatePatient(req, res) {
  try {
    const accountID = parseFloat(req.params.accountID);
    console.log(accountID, req.account.idw);
    if (accountID !== req.account.id) {
      throwNotAuthorizedError();
    }

    const patient = req.body;
    patient.accountID = accountID;

    const updPatient = await AccountService.updatePatient(patient);

    return res.json(updPatient);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function updateDoctor(req, res) {
  try {
    const accountID = parseFloat(req.params.accountID);

    if (accountID !== req.account.id) {
      throwNotAuthorizedError();
    }

    const doctor = req.body;
    doctor.accountID = accountID;

    const updDoctor = await AccountService.updateDoctor(doctor);

    return res.json(updDoctor);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  getPatient,
  getDoctor,
  updateDoctor,
  updatePatient,
  getAllPatients,
  getAllDoctors
};
