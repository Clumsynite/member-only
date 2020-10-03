const express = require('express');
const router = express.Router()

const authenticationController = require('../controllers/authenticationController');
const messageController = require('../controllers/messageController');

router.get('/', messageController.get_messages)

router.get('/login', authenticationController.login_get)

router.get('/signup', authenticationController.signup_get)

router.post('/signup', authenticationController.signup_post)

module.exports = router