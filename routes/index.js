const express = require('express');
const router = express.Router()

const authenticationController = require('../controllers/authenticationController');

router.get('/', authenticationController.login_get)

module.exports = router