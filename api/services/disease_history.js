const knex = require('../knex');
const moment = require('moment');

function formatDiseaseHistory(diseaseHistories) {
  const formatted = {};

  const diseaseStatuses = {};
  const diseaseAnalysis = {};

  diseaseHistories.forEach((disease) => {
    if (!formatted[disease.diseaseHistoryID]) {
      formatted[disease.diseaseHistoryID] = {
        diseaseHistoryID: disease.diseaseHistoryID,
        diseaseName: disease.diseaseName,
        diseaseDescription: disease.diseaseDescription,
        patientID: disease.patientID,
        statuses: [],
        analysis: []
      };

      diseaseStatuses[disease.diseaseHistoryID] = [];
      diseaseAnalysis[disease.diseaseHistoryID] = [];
    }

    if (disease.diseaseStatusID && !diseaseStatuses[disease.diseaseHistoryID].includes(disease.diseaseStatusID)) {
      formatted[disease.diseaseHistoryID].statuses.push({
        statusID: disease.diseaseStatusID,
        status: disease.diseaseStatus,
        time: disease.diseaseStatusTime
      });

      diseaseStatuses[disease.diseaseHistoryID].push(disease.diseaseStatusID);
    }

    if (disease.patientAnalysisID && !diseaseAnalysis[disease.diseaseHistoryID].includes(disease.patientAnalysisID)) {
      formatted[disease.diseaseHistoryID].analysis.push({
        patientAnalysisID: disease.patientAnalysisID,
        analysisResult: disease.patientAnalysisResult,
        analysisStartTime: disease.patientAnalysisStartTime,
        analysisEndTime: disease.patientAnalysisEndTime,
        analysisName: disease.analysisName
      });

      diseaseAnalysis[disease.diseaseHistoryID].push(disease.patientAnalysisID);
    }
  });

  return Object.values(formatted);
}

async function updateDiseaseHistoryStatus({ diseaseHistoryID, status, trx }) {
  return trx('disease_status')
    .insert({
      disease_id: diseaseHistoryID,
      status,
      time: moment().format('YYYY-MM-DD HH:mm')
    });
}

async function getAllDiseaseHistories() {
  const diseaseHistories = await knex('disease_status')
    .select(
      'disease_history.id as diseaseHistoryID',
      'disease_history.name as diseaseName',
      'disease_history.description as diseaseDescription',
      'disease_history.id as diseaseID',
      'disease_history.patient_id as patientID',
      'disease_status.id as diseaseStatusID',
      'disease_status.status as diseaseStatus',
      'disease_status.time as diseaseStatusTime',
      'patient_analysis.id as patientAnalysisID',
      'patient_analysis.result as patientAnalysisResult',
      'patient_analysis.start_date as patientAnalysisStartTime',
      'patient_analysis.end_date as patientAnalysisEndTime',
      'analysis.name as analysisName'
    )
    .innerJoin('disease_history', 'disease_history.id', 'disease_status.disease_id')
    .leftJoin('disease_analysis', 'disease_analysis.disease_history_id', 'disease_history.id')
    .leftJoin('patient_analysis', 'disease_analysis.patient_analysis_id', 'patient_analysis.id')
    .leftJoin('analysis', 'analysis.id', 'patient_analysis.analysis_id')

  return formatDiseaseHistory(diseaseHistories);
}

async function getAllPatientDiseasesHistories(patientID) {
  const diseaseHistory = await knex('disease_status')
    .select(
      'disease_history.id as diseaseHistoryID',
      'disease_history.name as diseaseName',
      'disease_history.description as diseaseDescription',
      'disease_history.id as diseaseID',
      'disease_history.patient_id as patientID',
      'disease_status.id as diseaseStatusID',
      'disease_status.status as diseaseStatus',
      'disease_status.time as diseaseStatusTime',
      'patient_analysis.id as patientAnalysisID',
      'patient_analysis.result as patientAnalysisResult',
      'patient_analysis.start_date as patientAnalysisStartTime',
      'patient_analysis.end_date as patientAnalysisEndTime',
      'analysis.name as analysisName'
    )
    .innerJoin('disease_history', 'disease_history.id', 'disease_status.disease_id')
    .leftJoin('disease_analysis', 'disease_analysis.disease_history_id', 'disease_history.id')
    .leftJoin('patient_analysis', 'disease_analysis.patient_analysis_id', 'patient_analysis.id')
    .leftJoin('analysis', 'analysis.id', 'patient_analysis.analysis_id')
    .where('disease_history.patient_id', patientID);

  return formatDiseaseHistory(diseaseHistory);
}

async function getPatientDiseaseHistory(diseaseID) {
  const diseaseHistory = await knex('disease_status')
    .select(
      'disease_history.id as diseaseHistoryID',
      'disease_history.name as diseaseName',
      'disease_history.description as diseaseDescription',
      'disease_history.id as diseaseID',
      'disease_history.patient_id as patientID',
      'disease_status.id as diseaseStatusID',
      'disease_status.status as diseaseStatus',
      'disease_status.time as diseaseStatusTime',
      'patient_analysis.id as patientAnalysisID',
      'patient_analysis.result as patientAnalysisResult',
      'patient_analysis.start_date as patientAnalysisStartTime',
      'patient_analysis.end_date as patientAnalysisEndTime',
      'analysis.name as analysisName'
    )
    .innerJoin('disease_history', 'disease_history.id', 'disease_status.disease_id')
    .leftJoin('disease_analysis', 'disease_analysis.disease_history_id', 'disease_history.id')
    .leftJoin('patient_analysis', 'disease_analysis.patient_analysis_id', 'patient_analysis.id')
    .leftJoin('analysis', 'analysis.id', 'patient_analysis.analysis_id')
    .where('disease_history.id', diseaseID);

  if (diseaseHistory.length === 0) {
    const error = new Error('There is not disease history with such id');
    error.status = 404;
    throw error;
  }

  return formatDiseaseHistory(diseaseHistory)[0];
}

async function addDisease({ patientID, diseaseName, description }) {
  const newDiseaseHistoryID = await knex.transaction(async (trx) => {
    const [diseaseHistoryID] = await trx('disease_history')
      .insert({
        patient_id: patientID,
        name: diseaseName,
        description: JSON.stringify(description)
      }).returning('id');
    
    await updateDiseaseHistoryStatus({ diseaseHistoryID, status: 'sick', trx });
      
    return diseaseHistoryID;
  });

  return getPatientDiseaseHistory(newDiseaseHistoryID);
}

async function updateDiseaseHistory({ diseaseID, status, description }) {
  await knex.transaction(async (trx) => {
    await updateDiseaseHistoryStatus({ diseaseHistoryID: diseaseID, status, trx });

    if (description) {
      await trx('disease_history')
        .update({
          description
        })
        .where('id', diseaseID);
    }
  });

  return getPatientDiseaseHistory(diseaseID);
}

async function addAnalysisToDiseaseHistory({ diseaseID, patientAnalysisID }) {
  await knex('disease_analysis')
    .insert({
      disease_history_id: diseaseID,
      patient_analysis_id: patientAnalysisID
    });

  return getPatientDiseaseHistory(diseaseID);
}


module.exports = {
  addDisease,
  getAllDiseaseHistories,
  updateDiseaseHistory,
  addAnalysisToDiseaseHistory,
  getPatientDiseaseHistory,
  getAllPatientDiseasesHistories
};
