const express = require('express')

const router = new express.Router()

// Controller
const authController = require('../controller/auth-controller')
const postController = require('../controller/post-controller')

const { authenticate } = require('../middleware/auth-middleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/send-email-user', authController.sendEmailAllUser)

router.use(authenticate)
router.post('/post-link', postController.addPostandLink)
module.exports = router
