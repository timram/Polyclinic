const express = require('express');

const { Ping } = require('../controllers');

const router = new express.Router();

router.get('/', Ping.success);
router.get('/:pingID', Ping.getPing);

module.exports = router;
