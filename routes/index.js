const express = require('express');
const ping = require('./ping');

const router = new express.Router();

router.use('/ping', ping);

module.exports = router;
