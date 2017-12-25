const express = require('express');
const { DiseaseHistory } = require('../controllers');

const router = new express.Router();

router.post('/', DiseaseHistory.addDisease);
router.get('/', DiseaseHistory.getAllDiseaseHistories);
router.put('/:diseaseID', DiseaseHistory.updateDiseaseHistory);
router.post('/:diseaseID', DiseaseHistory.addAnalysisToDiseaseHistory);
router.get('/patient/:patientID/:diseaseID', DiseaseHistory.getPatientDiseaseHistory);
router.get('/patient/:patientID', DiseaseHistory.getAllPatientDiseasesHistories);

module.exports = router;
