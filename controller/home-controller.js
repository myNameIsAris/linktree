const home = (req, res) => {
	return res.render('../views/pages/home/index', {
		// name : 'Aris'
	})
}

const login = (req, res) => {
	// console.log(req.flash('success'))
	return res.render('../views/pages/home/login', {
		success: req.flash('success')[0],
		error: req.flash('error')[0],
		prevData: req.flash('prevData')[0],
	})
}

const register = (req, res) => {
	return res.render('../views/pages/home/register', {
		success: req.flash('success')[0],
		error: req.flash('error')[0],
		prevData: req.flash('prevData')[0],
	})
}

const forgetPassword = async (req, res) => {
	return res.render('../views/pages/home/forget-password', {
		success: req.flash('success')[0],
		error: req.flash('error')[0],
	})
}

const changePassword = async (req, res) => {
	const { token } = req.params
	// console.log(token)
	return res.render('../views/pages/home/change-password', {
		token,
	})
}

module.exports = {
	home,
	login,
	register,
	forgetPassword,
	changePassword,
}
