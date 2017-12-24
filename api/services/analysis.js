const knex = require('../knex');
const moment = require('moment');
const { CheckSchedule } = require('../helpers');

function throwOverScheduleError() {
  const error = new Error('You are out of the schedule bounds!');
  error.status = 400;
  throw error;
}

function transformPatientAnalysis(patientAnalysis) {
  if (patientAnalysis.length === 0) {
    return [];
  }

  const transformed = {};

  patientAnalysis.forEach((analysis) => {
    if (!transformed[analysis.patientAnalysisID]) {
      transformed[analysis.patientAnalysisID] = {
        patientAnalysisID: analysis.patientAnalysisID,
        analysisName: analysis.analysisName,
        result: analysis.analysisResult,
        startTime: analysis.analysisStartTime,
        endTime: analysis.analysisEndTime,
        statuses: []
      };
    }

    transformed[analysis.patientAnalysisID].statuses.push({
      status: analysis.analysisStatus,
      time: analysis.analysisStatusTime
    });
  });

  return Object.values(transformed);
}

async function checkAnalysisTime({ analysis, time }) {
  if (!CheckSchedule.isValidRecordTime({ time: new Date(time), schedule: analysis.schedule })) {
    return false;
  }

  const existsRecordsOnTime = await knex('patient_analysis')
    .select('id')
    .where('start_date', '<', moment(time).add(analysis.duration, 'm').toDate())
    .where('end_date', '>', time);

  if (existsRecordsOnTime.length > 0) {
    return false;
  }

  return true;
}

async function updatePatientAnalysisStatus({ patientAnalysisID, status, trx }) {
  return trx('analysis_status').insert({
    patient_analysis_id: patientAnalysisID,
    status,
    time: moment().format('YYYY-MM-DD HH:mm')
  });
}

async function getAllAnalysis() {
  return knex('analysis')
    .select('id', 'duration', 'name', 'schedule');
}

async function getAnalysis(analysisID) {
  const [analysis] = await knex('analysis')
    .select('id', 'duration', 'name', 'schedule')
    .where('id', analysisID);

  if (!analysis) {
    const error = new Error('There is not analysis with such id');
    error.status = 404;
    throw error;
  }

  return analysis;
}

async function getAllPatientAnalysis(patientID) {
  const analysis = await knex('patient_analysis')
    .select(
      'patient_analysis.id as patientAnalysisID',
      'patient_analysis.result as analysisResult',
      'patient_analysis.start_date as analysisStartTime',
      'patient_analysis.end_date as analysisEndTime',
      'analysis.name as analysisName',
      'analysis_status.status as analysisStatus',
      'analysis_status.time as analysisStatusTime'
    )
    .innerJoin('analysis', 'analysis.id', 'patient_analysis.analysis_id')
    .innerJoin('analysis_status', 'analysis_status.patient_analysis_id', 'patient_analysis.id')
    .innerJoin('doctor_appointment', 'doctor_appointment.id', 'patient_analysis.appointment_id')
    .where('doctor_appointment.patient_id', patientID);

  return transformPatientAnalysis(analysis);
}

async function getPatientAnalysis(patientAnalysisID) {
  const analysis = await knex('patient_analysis')
    .select(
      'patient_analysis.id as patientAnalysisID',
      'patient_analysis.result as analysisResult',
      'patient_analysis.start_date as analysisStartTime',
      'patient_analysis.end_date as analysisEndTime',
      'analysis.name as analysisName',
      'analysis_status.status as analysisStatus',
      'analysis_status.time as analysisStatusTime'
    )
    .innerJoin('analysis', 'analysis.id', 'patient_analysis.analysis_id')
    .innerJoin('analysis_status', 'analysis_status.patient_analysis_id', 'patient_analysis.id')
    .where('patient_analysis.id', patientAnalysisID);

  if (analysis.length === 0) {
    const error = new Error('There is not patient analysis with such id');
    error.status = 404;
    throw error;
  }

  return transformPatientAnalysis(analysis)[0];
}

async function recordPatientToAnalysis({ appointmentID, analysisID, startTime }) {
  const patientAnalysisID = await knex.transaction(async (trx) => {
    const [analysis] = await trx('analysis')
      .select('id', 'schedule', 'duration')
      .where('id', analysisID);

    if (!analysis) {
      const error = new Error('There is not analysis with such id');
      error.status = 404;
      throw error;
    }

    const isValidTime = await checkAnalysisTime({ analysis, time: startTime });

    if (!isValidTime) {
      throwOverScheduleError();
    }

    const [recordID] = await trx('patient_analysis')
      .insert({
        result: '{}',
        start_date: startTime,
        end_date: moment(startTime).add(analysis.duration, 'm').toDate(),
        analysis_id: analysisID,
        appointment_id: appointmentID
      }).returning('id');

    await updatePatientAnalysisStatus({
      patientAnalysisID: recordID,
      status: 'pending',
      trx
    });

    return recordID;
  });

  return getPatientAnalysis(patientAnalysisID);
}

async function updatePatientAnalysis({ patientAnalysisID, status, result }) {
  await knex.transaction(async (trx) => {
    await updatePatientAnalysisStatus({
      patientAnalysisID,
      status,
      trx
    });

    if (result) {
      await trx('patient_analysis')
        .update('result', result)
        .where('id', patientAnalysisID);
    }
  });

  return getPatientAnalysis(patientAnalysisID);
}

module.exports = {
  getAllAnalysis,
  getAnalysis,
  recordPatientToAnalysis,
  getPatientAnalysis,
  getAllPatientAnalysis,
  updatePatientAnalysis
};
