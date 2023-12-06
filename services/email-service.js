const nodemailer = require('nodemailer')

const User = require('../model/users-model')
const { smtp } = require('../utils/variabel')

const transporter = nodemailer.createTransport({
	port: smtp.port,
	host: smtp.host,
	auth: {
		user: smtp.email,
		pass: smtp.password,
	},
	secure: true,
})

const sendEmailAllUser = async () => {
	const allUser = await User.find({})
	const options = {
		from: 'chalkfoust@gmail.com',
		to: 'arisakhyar704@gmail.com',
		subject: 'Email Otomatis Dari Artree',
		text: 'Jumlah User Saat Ini Adalah ' + allUser.length,
	}

	try {
		await transporter.sendMail(options)
	} catch (err) {
		console.log(err)
	}
}

const sendEmail = async (options) => {
	options.from = smtp.email
	await transporter.sendMail(options)
}

module.exports = {
	sendEmailAllUser,
	sendEmail,
}
