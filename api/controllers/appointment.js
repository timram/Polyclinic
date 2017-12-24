const { ErrorHandler } = require('../helpers');
const { AppointmentService } = require('../services');

async function record(req, res) {
  try {
    const { patientID, doctorID, startTime } = req.body;

    if (patientID !== req.account.id || req.account.role !== 'patient') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const newRecord = await AppointmentService.record({ patientID, doctorID, startTime });

    return res.json(newRecord);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getPatientRecords(req, res) {
  try {
    const patientID = parseFloat(req.params.patientID);

    if (patientID !== req.account.id && req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const records = await AppointmentService.getPatientRecords(patientID);

    return res.json(records);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getPatientRecordsForDate(req, res) {
  try {
    const patientID = parseFloat(req.params.patientID);
    const { date } = req.params;

    if (patientID !== req.account.id && req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const records = await AppointmentService.getPatientRecordsForDate({ patientID, date });

    return res.json(records);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getDoctorRecords(req, res) {
  try {
    const { doctorID } = req.params;

    const isPatient = req.account.role === 'patient';

    const records = await AppointmentService.getDoctorRecords({ doctorID, isPatient });

    return res.json(records);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getDoctorRecordsForDate(req, res) {
  try {
    const doctorID = parseFloat(req.params.doctorID);
    const { date } = req.params;

    const isPatient = req.account.role === 'patient';

    const records = await AppointmentService.getDoctorRecordsForDate({ doctorID, date, isPatient });

    return res.json(records);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  record,
  getPatientRecords,
  getDoctorRecords,
  getDoctorRecordsForDate,
  getPatientRecordsForDate
};
