const express = require('express');
const ping = require('./ping');
const auth = require('./authorization');
const department = require('./department');
const { Authorization: authHelper } = require('../helpers');

const router = new express.Router();

router.use('/ping', ping);
router.use('/auth', auth);
router.use(authHelper);
router.use('/department', department);

module.exports = router;