const { ErrorHandler } = require('../helpers');
const { DiseaseHistoryService } = require('../services');

async function addDisease(req, res) {
  try {
    if (req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const { patientID, diseaseName, description } = req.body;

    const diseaseHistory = await DiseaseHistoryService.addDisease({ patientID, diseaseName, description });

    return res.json(diseaseHistory);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getAllDiseaseHistories(req, res) {
  try {
    if (req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const diseasesHistories = await DiseaseHistoryService.getAllDiseaseHistories();

    return res.json(diseasesHistories);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function updateDiseaseHistory(req, res) {
  try {
    if (req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const diseaseID = parseFloat(req.params.diseaseID);

    const { status, description } = req.body;

    const updDiseaseHistory = await DiseaseHistoryService.updateDiseaseHistory({
      diseaseID,
      status,
      description
    });

    return res.json(updDiseaseHistory);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function addAnalysisToDiseaseHistory(req, res) {
  try {
    if (req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const diseaseID = parseFloat(req.params.diseaseID);

    const { patientAnalysisID } = req.body;

    const updDiseaseHistory = await DiseaseHistoryService.addAnalysisToDiseaseHistory({
      diseaseID,
      patientAnalysisID
    });

    return res.json(updDiseaseHistory);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getPatientDiseaseHistory(req, res) {
  try {
    const patientID = parseFloat(req.params.patientID);
    const diseaseID = parseFloat(req.params.diseaseID);

    if (patientID !== req.account.id && req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const diseaseHistory = await DiseaseHistoryService.getPatientDiseaseHistory(diseaseID);

    return res.json(diseaseHistory);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

async function getAllPatientDiseasesHistories(req, res) {
  try {
    const patientID = parseFloat(req.params.patientID);

    if (patientID !== req.account.id && req.account.role !== 'doctor') {
      return ErrorHandler.notAuthorizedAccess(res);
    }

    const diseasesHistories = await DiseaseHistoryService.getAllPatientDiseasesHistories(patientID);

    return res.json(diseasesHistories);
  } catch (err) {
    return ErrorHandler.genericError(res, err);
  }
}

module.exports = {
  addDisease,
  getAllDiseaseHistories,
  updateDiseaseHistory,
  addAnalysisToDiseaseHistory,
  getPatientDiseaseHistory,
  getAllPatientDiseasesHistories
};
