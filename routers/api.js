const express = require('express')

const router = new express.Router()

const authController = require('../controller/auth-controller')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/send-email-user', authController.sendEmailAllUser)
module.exports = router
