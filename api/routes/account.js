const express = require('express');
const { Account } = require('../controllers');

const router = new express.Router();

router.get('/patient/all', Account.getAllPatients);
router.get('/doctor/all', Account.getAllDoctors);
router.get('/patient/:accountID', Account.getPatient);
router.get('/doctor/:accountID', Account.getDoctor);
router.put('/patient/:accountID', Account.updatePatient);
router.put('/doctor/:accountID', Account.updateDoctor);

module.exports = router;
