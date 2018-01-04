const knex = require('../knex');
const moment = require('moment');

const { CheckSchedule } = require('../helpers');

function throwOverScheduleError() {
  const error = new Error('You are out of the schedule bounds!');
  error.status = 400;
  throw error;
}

async function checkDoctorTime({ doctor, time }) {
  if (!CheckSchedule.isValidRecordTime({ time, schedule: doctor.schedule })) {
    return false;
  }

  const existsRecordsOnTime = await knex('doctor_appointment')
    .select('id')
    .where('start_date', '<', moment(time).add(doctor.admissionDuration, 'm').toDate())
    .where('end_date', '>', time)
    .where('doctor_id', doctor.id);

  if (existsRecordsOnTime.length > 0) {
    return false;
  }

  return true;
}

async function record({ patientID, doctorID, startTime }) {
  const [newRecord] = await knex.transaction(async (trx) => {
    const [doctor] = await trx('doctor')
      .select(
        'account_id as id',
        'admission_duration as admissionDuration',
        'schedule'
      )
      .where('account_id', doctorID);
    
    if (!doctor) {
      const error = new Error('There is not doctor with such id');
      error.status = 404;
      throw error;
    }

    const isValidTime = await checkDoctorTime({ doctor, time: new Date(startTime), trx });

    if (!isValidTime) {
      throwOverScheduleError();
    }

    return trx('doctor_appointment')
      .insert({
        start_date: startTime,
        end_date: moment(startTime).add(doctor.admissionDuration, 'm').toDate(),
        patient_id: patientID,
        doctor_id: doctorID
      }).returning('*');
  });

  return newRecord;
}

async function getPatientRecords(patientID) {
  return knex('doctor_appointment')
    .select('id', 'start_date', 'end_date', 'patient_id', 'doctor_id')
    .where('patient_id', patientID);
}

async function getPatientRecordsForDate({ patientID, date }) {
  return knex('doctor_appointment')
    .select('id', 'start_date', 'end_date', 'patient_id', 'doctor_id')
    .where('patient_id', patientID)
    .where('start_date', '>', date)
    .where('start_date', '<', moment(date).add(24, 'h').format());
}

async function getDoctorRecords({ doctorID, isPatient }) {
  const doctorAppointmentRequest = knex('doctor_appointment')
    .select('id', 'start_date', 'end_date', 'doctor_id')
    .where('doctor_id', doctorID);

  if (!isPatient) {
    doctorAppointmentRequest.select('patient_id');
  }

  return doctorAppointmentRequest;
}

async function getDoctorRecordsForDate({ doctorID, isPatient, date }) {
  const doctorAppointmentRequest = knex('doctor_appointment')
    .select('id', 'start_date', 'end_date', 'doctor_id')
    .where('doctor_id', doctorID)
    .where('start_date', '>', date)
    .where('start_date', '<', moment(date).add(24, 'h').format());

  if (!isPatient) {
    doctorAppointmentRequest.select('patient_id');
  }

  return doctorAppointmentRequest;
}

module.exports = {
  record,
  getPatientRecords,
  getDoctorRecords,
  getDoctorRecordsForDate,
  getPatientRecordsForDate
};
