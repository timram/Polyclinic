const express = require('express');
const { Auth } = require('../controllers');

const router = new express.Router();

router.post('/register/patient', Auth.registerPatient);
router.post('/register/doctor', Auth.registerDoctor);
router.post('/login/patient', Auth.loginPatient);
router.post('/login/doctor', Auth.loginDoctor);

module.exports = router;
