require('dotenv').config()

module.exports = {
	port: process.env.PORT || 3000,
	smtp: {
		email: process.env.SMTP_EMAIL,
		password: process.env.SMTP_PASSWORD,
	},
}
