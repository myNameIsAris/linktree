const express = require('express')
const app = express()
const cors = require('cors')
const layout = require('express-ejs-layouts')

const {port} = require('./utils/variabel')

// Router
const webRouter = require('./router')

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
// app.use(layout)
app.use(cors())
app.use(express.json({extended : false}))

app.use(webRouter)

app.listen(port, () => {
    console.log('Berjalan Server')
})