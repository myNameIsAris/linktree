const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

// Import DB
const prisma = require('../utils/database')

// Import Validator
const userValidate = require('../validator/users-validation')
const authValidate = require('../validator/auth-validation')
const { validate } = require('../validator/validation')

// Import Service
const emailService = require('../services/email-service')

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

module.exports = {
	register,
	login,
	logout,
	sendEmailAllUser,
}
