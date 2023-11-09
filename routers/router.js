const express = require('express')

const router = new express.Router()

// Controller
const homeController = require('../controller/home-controller')
const authController = require('../controller/auth-controller')
const dashboardController = require('../controller/dashboard-controller')

// Middleware
const authMiddleware = require('../middleware/auth-middleware')

router.get('/', homeController.home)
router.get('/login', homeController.login)
router.get('/register', homeController.register)

router.use(authMiddleware.authenticate)
router.get('/logout', authController.logout)
router.get('/dashboard', dashboardController.dashboard)

module.exports = router
