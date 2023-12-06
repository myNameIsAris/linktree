const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')
const crypto = require('crypto')

// Import DB
const prisma = require('../utils/database')

// Import Validator
const userValidate = require('../validator/users-validation')
const authValidate = require('../validator/auth-validation')
const { validate } = require('../validator/validation')

// Import Service
const emailService = require('../services/email-service')
const { baseUrl } = require('../utils/variabel')

const register = async (req, res) => {
	// Validate Request
	const [data, error] = validate(userValidate.createUser, req.body)

	if (error) {
		req.flash('error', 'Terdapat Kesalahan Pada Input Anda')
		req.flash('prevData', data)
		console.log(error)
		return res.redirect('/register')
	}

	// Check Username
	const usernameFound = await prisma.users.findFirst({
		where: {
			username: data.username,
		},
	})
	if (usernameFound) {
		req.flash('error', 'Username Telah Digunakan')
		req.flash('prevData', data)
		return res.redirect('/register')
	}

	// Check Email
	const emailFound = await prisma.users.findFirst({
		where: {
			email: data.email,
		},
	})
	if (emailFound) {
		req.flash('prevData', data)
		req.flash('error', 'Email Telah Digunakan')
		return res.redirect('/register')
	}

	// Create User
	data.role = 3
	data.password = bcrypt.hashSync(data.password, 3)
	await prisma.users.create({ data })

	// Set Session
	req.flash('success', 'Berhasil Menambah User')
	return res.redirect('/login')
}

const login = async (req, res) => {
	// Validate Request
	const [data, error] = validate(authValidate.login, req.body)

	if (error) {
		req.flash('error', 'Terdapat Kesalahan Pada Input Anda')
		req.flash('prevData', data)
		console.log(error)
		return res.redirect('/login')
	}

	const user = await prisma.users.findFirst({
		where: {
			username: data.username,
		},
	})
	if (!user) {
		req.flash('error', 'User dengan Username Tersebut Tidak Ditemukan')
		req.flash('prevData', data)
		return res.redirect('/login')
	}

	// Check Password
	if (!bcrypt.compareSync(data.password, user.password)) {
		req.flash('error', 'Password yang Dimasukkan Salah')
		req.flash('prevData', data)
		return res.redirect('/login')
	}

	// Generate Token
	const token = uuid().toString()
	await prisma.users.update({
		where: {
			id: user.id,
		},
		data: {
			token,
		},
	})

	// Set Cookie
	res.cookie('token', token)

	return res.redirect('/dashboard')
}

const logout = async (req, res) => {
	await prisma.users.update({
		where: {
			id: req.user.id,
		},
		data: {
			token: null,
		},
	})
	res.clearCookie('token')

	return res.redirect('/login')
}

const sendEmailAllUser = async (req, res) => {
	await emailService.sendEmailAllUser()
	return res.send({
		status: 'Berhasil',
	})
}

const forgetPassword = async (req, res) => {
	// Validate Request
	const [data, error] = validate(authValidate.forget, req.body)

	if (error) {
		req.flash('error', 'Terdapat Kesalahan Pada Input Anda')
		console.log(error)
		return res.redirect('/reset-password')
	}

	// Find User By Email
	const user = await prisma.users.findFirst({
		where: {
			email: data.email,
		},
	})
	if (!user) {
		req.flash('error', 'Email Anda Belum Terdaftar')
		console.log(error)
		return res.redirect('/reset-password')
	}

	// Find Email in Forget Token
	const forget = await prisma.forgetPassword.findFirst({
		where: {
			email: data.email,
		},
	})
	if (forget) {
		req.flash('error', 'Email Reset Sudah Ada, Silahkan Cek Email Anda')
		console.log(error)
		return res.redirect('/reset-password')
	}

	// Generate Token For Reset Password
	const token = crypto.randomBytes(20).toString('hex')
	await prisma.forgetPassword.create({
		data: {
			email: data.email,
			token,
		},
	})

	// Send Email
	const url = `${baseUrl}/change-password/${token}`
	const options = {
		to: data.email,
		subject: 'RESET PASSWORD OF ARTREE',
		html:
			'<h1> Silahkan Klik Link Dibawah Untuk Reset Password </h1> <br> ' + url,
	}
	await emailService.sendEmail(options)

	req.flash('success', 'Silahkan Cek Email Anda')
	return res.redirect('/login')
}

const changePassword = async (req, res) => {
	const { token, password } = req.body

	// Find Forgot Password
	const forgotPassword = await prisma.forgetPassword.findFirst({
		where: {
			token,
		},
	})
	if (!forgotPassword) {
		req.flash('error', 'Terdapat Kesalahan Pada Input Anda')
		return res.redirect('/reset-password')
	}

	// Change Password
	await prisma.users.update({
		where: {
			email: forgotPassword.email,
		},
		data: {
			password: bcrypt.hashSync(password, 3),
		},
	})

	// Delete Token
	await prisma.forgetPassword.delete({
		where: {
			token,
		},
	})

	req.flash('success', 'Password Berhasil Diubah, Silahkan Login Kembali')
	return res.redirect('/login')
}

module.exports = {
	register,
	login,
	logout,
	sendEmailAllUser,
	forgetPassword,
	changePassword,
}
