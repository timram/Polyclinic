const express = require('express');
const { Department } = require('../controllers');

const router = new express.Router();

router.get('/', Department.getAllDepartments);
router.get('/:departmentID', Department.getDepartment);
router.get('/:departmentID/doctors', Department.getDoctors);

module.exports = router;
