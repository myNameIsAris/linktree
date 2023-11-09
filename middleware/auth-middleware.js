const User = require('../model/users-model')

const authenticate = async (req, res, next) => {
	// Get Cookie
	const token = req.cookies.token
	// console.log(req.cookies)
	if (!token) {
		req.flash('error', 'Anda Belum Login, Login Terlebih Dahulu')
		return res.redirect('/login')
	}

	// Find Token
	const user = await User.findOne({
		token,
	})
	if (!user) {
		req.flash('error', 'Token Yang Digunakan Tidak Valid')
		return res.redirect('/login')
	}

	// Set User
	req.user = user
	next()
}

module.exports = {
	authenticate,
}
