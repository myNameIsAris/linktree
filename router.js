const express = require('express')

const router = new express.Router()

router.get('/', (req, res) => {
    return res.render('../views/pages/index', {
        name : 'Aris'
    })
})

router.get('/login', (req, res) => {
    return res.render('../views/pages/login', {
        name : 'Aris'
    })
})

module.exports = router