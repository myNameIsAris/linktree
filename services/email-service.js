const nodemailer = require('nodemailer')

const User = require('../model/users-model')

const transporter = nodemailer.createTransport({
	port: 465,
	host: 'smtp.gmail.com',
	auth: {
		user: 'chalkfoust@gmail.com',
		pass: 'ycbw jpuk eshs vygq',
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

	transporter.sendMail(options, function (err, info) {
		if (err) console.log(err)
		else console.log(info)
	})
}

module.exports = {
	sendEmailAllUser,
}
