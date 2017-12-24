const { ErrorHandler } = require('../helpers');
const { AnalysisService } = require('../services');

async function getAllAnalysis(req, res) {
  try {
    const analysis = await AnalysisService.getAllAnalysis();

    return res.json(analysis);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getAnalysis(req, res) {
  try {
    const analysisID = parseFloat(req.params.analysisID);

    const analysis = await AnalysisService.getAnalysis(analysisID);

    return res.json(analysis);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getAllPatientAnalysis(req, res) {
  try {
    const patientID = parseFloat(req.params.patientID);

    if (patientID !== req.account.id && req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const patientAnalysis = await AnalysisService.getAllPatientAnalysis(patientID);

    return res.json(patientAnalysis);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getPatientAnalysis(req, res) {
  try {
    const patientID = parseFloat(req.params.patientID);
    const patientAnalysisID = parseFloat(req.params.patientAnalysisID);

    if (patientID !== req.account.id && req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const patientAnalysis = await AnalysisService.getPatientAnalysis(patientAnalysisID);

    return res.json(patientAnalysis);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function recordPatientToAnalysis(req, res) {
  try {
    const { appointmentID, analysisID, startTime } = req.body;

    if (req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const patientAnalysis = await AnalysisService.recordPatientToAnalysis({
      appointmentID,
      analysisID,
      startTime
    });

    return res.json(patientAnalysis);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function updatePatientAnalysis(req, res) {
  try {
    const patientAnalysisID = parseFloat(req.params.patientAnalysisID);
    const { status, result } = req.body;

    if (req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const updPatientAnalysis = await AnalysisService.updatePatientAnalysis({
      patientAnalysisID,
      status,
      result
    });

    return res.json(updPatientAnalysis);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  getAllAnalysis,
  getAnalysis,
  recordPatientToAnalysis,
  getPatientAnalysis,
  getAllPatientAnalysis,
  updatePatientAnalysis
};
