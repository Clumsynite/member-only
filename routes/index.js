const express = require('express');
const router = express.Router()

const authenticationController = require('../controllers/authenticationController');

router.get('/', authenticationController.signup_get)

module.exports = router