const express = require('express')

const router = new express.Router()

const homeController = require('./controller/home-controller')

router.get('/', homeController.home)
router.get('/login', homeController.login)
router.get('/register', homeController.register)

module.exports = router