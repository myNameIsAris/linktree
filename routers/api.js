const express = require('express')

const router = new express.Router()

// Controller
const authController = require('../controller/auth-controller')
const postController = require('../controller/post-controller')

const { authenticate } = require('../middleware/auth-middleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/send-email-user', authController.sendEmailAllUser)

router.get('/post-activity/all', postController.getAllVisitor)
router.use(authenticate)
router.get('/post-activity/user', postController.getPostActivityByUser)
router.get('/post-activity/:id', postController.getPostActivityById)
router.post('/post-link', postController.addPostandLink)
router.put('/post-link/:id', postController.editPostandLink)
router.get('/post/:id', postController.getPostById)
router.delete('/link/:id', postController.deleteLink)
router.delete('/post/:id', postController.deletePost)
module.exports = router
