const express = require('express')
const app = express()
const cors = require('cors')
const layout = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const winston = require('winston')
const expressWinston = require('express-winston')
const { port } = require('./utils/variabel')

// DB
// require('./utils/db')

// Router
const webRouter = require('./routers/router')
const apiRouter = require('./routers/api')

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(
	expressWinston.logger({
		transports: [new winston.transports.Console()],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple(),
			winston.format.json()
		),
		// meta: true, // menyertakan metadata seperti timestamp
		msg: 'HTTP {{req.method}} {{req.url}}',
		colorize: true,
	})
)

app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
	session({
		secret: 'secret-key',
		resave: false,
		saveUninitialized: false,
	})
)
app.use(flash())

// Using Router
app.use('/api/', apiRouter)
app.use(webRouter)

app.listen(port, () => {
	console.log('Berjalan Server')
})
