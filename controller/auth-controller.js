const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

// Import Model
const User = require('../model/users-model')

// Import Validator
const userValidate = require('../validator/users-validation')
const authValidate = require('../validator/auth-validation')
const { validate } = require('../validator/validation')

// Import Service
const emailService = require('../services/email-service')

const register = async (req, res) => {
	// Validate Request
	const [data, error] = validate(authValidate.login, req.body)

	if (error) {
		req.flash('error', 'Terdapat Kesalahan Pada Input Anda')
		req.flash('prevData', data)
		return res.redirect('/login')
	}

	// Check Username
	const usernameFound = await User.findOne({
		username: data.username,
	})
	if (usernameFound) {
		req.flash('error', 'Username Telah Digunakan')
		req.flash('prevData', data)
		return res.redirect('/register')
	}

	// Check Email
	const emailFound = await User.findOne({
		email: data.email,
	})
	if (emailFound) {
		req.flash('prevData', data)
		req.flash('error', 'Email Telah Digunakan')
		return res.redirect('/register')
	}

	// Create User
	data.role = 3
	data.password = bcrypt.hashSync(data.password, 3)
	await User.create(data)

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
		return res.redirect('/login')
	}

	// Check Username
	const user = await User.findOne({
		username: data.username,
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
	user.token = token
	await user.save()

	// Set Cookie
	res.cookie('token', token)

	return res.redirect('/dashboard')
}

const logout = async (req, res) => {
	// Find User
	const user = await User.findById(req.user.id)

	// Remove Token and Cookies
	user.token = null
	await user.save()
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
