const dashboard = (req, res, next) => {
	const user = req.user

	return res.render('../views/pages/dashboard/dashboard', {
		user,
	})
}

module.exports = {
	dashboard,
}
