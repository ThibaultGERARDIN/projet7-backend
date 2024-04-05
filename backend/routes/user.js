const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const validateEmail = require('../middleware/email-validator')
const validatePassword = require('../middleware/pwd-validator')

router.post('/signup', validateEmail, validatePassword, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router
