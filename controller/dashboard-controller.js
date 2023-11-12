const Users = require('../model/users-model')
const Posts = require('../model/posts-model')

const dashboard = (req, res) => {
	const user = req.user

	return res.render('../views/pages/dashboard/dashboard', {
		user,
	})
}

const link = async (req, res) => {
	const user = req.user

	const userPost = await Posts.find({
		id_user: user.id,
	}).populate('links')
	console.log(userPost)

	return res.render('../views/pages/dashboard/link', {
		user,
	})
}

module.exports = {
	dashboard,
	link,
}
