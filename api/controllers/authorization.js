const { AuthService } = require('../services');
const { ErrorHandler } = require('../helpers');

async function registerPatient(req, res) {
  try {
    const patient = req.body;
    patient.role = 'patient';

    const token = await AuthService.registerPatient(patient);

    return res.json(token);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function registerDoctor(req, res) {
  try {
    const doctor = req.body;
    doctor.role = 'doctor';

    const token = await AuthService.registerDoctor(doctor);

    return res.json(token);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function loginPatient(req, res) {
  try {
    const { email, password } = req.body;

    const token = await AuthService.loginPatient({ email, password });

    return res.json(token);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function loginDoctor(req, res) {
  try {
    const { email, password } = req.body;

    const token = await AuthService.loginDoctor({ email, password });

    return res.json(token);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  registerPatient,
  registerDoctor,
  loginPatient,
  loginDoctor
};
