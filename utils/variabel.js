require('dotenv').config()

module.exports = {
	port: process.env.PORT || 3000,
	smtp: {
		email: process.env.SMTP_EMAIL,
		password: process.env.SMTP_PASSWORD,
		port: process.env.SMTP_PORT,
		host: process.env.SMTP_HOST,
	},
	baseUrl: process.env.BASE_URL,
}
