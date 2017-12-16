const express = require('express');
const { Department } = require('../controllers');

const router = new express.Router();

router.get('/', Department.getAllDepartments);

module.exports = router;
