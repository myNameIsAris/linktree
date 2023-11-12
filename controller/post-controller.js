const Posts = require('../model/posts-model')
const Links = require('../model/links-model')

const addPostandLink = async (req, res) => {
	const { title, links } = req.body

	const payload = {
		id_user: req.user.id,
		title,
	}
	console.log(links)
	const post = await Posts.create(payload)

	for (const link of links) link.id_post = post._id

	await Links.insertMany(links)

	return res.redirect('/link')
}

module.exports = {
	addPostandLink,
}
