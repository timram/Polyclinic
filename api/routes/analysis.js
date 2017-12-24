const express = require('express');
const { Analysis } = require('../controllers');

const router = new express.Router();

router.get('/', Analysis.getAllAnalysis);
router.get('/:analysisID', Analysis.getAnalysis);
router.get('/patient/:patientID', Analysis.getAllPatientAnalysis);
router.get('/patient/:patientID/:patientAnalysisID', Analysis.getPatientAnalysis);
router.post('/patient', Analysis.recordPatientToAnalysis);
router.put('/patient/:patientID/:patientAnalysisID', Analysis.updatePatientAnalysis);

module.exports = router;
