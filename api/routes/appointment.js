const express = require('express');
const { Appointment } = require('../controllers');

const router = new express.Router();

router.post('/record', Appointment.record);
router.get('/record/patient/:patientID', Appointment.getPatientRecords);
router.get('/record/doctor/:doctorID', Appointment.getDoctorRecords);
router.get('/record/doctor/:doctorID/:date', Appointment.getDoctorRecordsForDate);
router.get('/record/patient/:patientID/:date', Appointment.getPatientRecordsForDate);

module.exports = router;
