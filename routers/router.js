const express = require('express')

const router = new express.Router()

// Controller
const homeController = require('../controller/home-controller')
const authController = require('../controller/auth-controller')
const dashboardController = require('../controller/dashboard-controller')
const postController = require('../controller/post-controller')

// Middleware
const authMiddleware = require('../middleware/auth-middleware')

router.get('/', homeController.home)
router.get('/login', homeController.login)
router.get('/register', homeController.register)
router.get('/t/:username/:url', postController.getPost)
router.get('/l/:id', postController.getLink)
router.get('/reset-password', homeController.forgetPassword)
router.get('/change-password/:token', homeController.changePassword)

router.use(authMiddleware.authenticate)
router.get('/logout', authController.logout)
router.get('/dashboard', dashboardController.dashboard)
router.get('/admin', dashboardController.admin)
router.get('/link', dashboardController.link)
router.get('/profile', dashboardController.profile)

module.exports = router
