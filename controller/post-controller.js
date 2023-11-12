const prisma = require('../utils/database')
const generator = require('randomstring')

const addPostandLink = async (req, res) => {
	const { title, links } = req.body

	const data = {
		id_user: req.user.id,
		title,
		url: generator.generate({
			length: 10,
			charset: 'alphabetic',
		}),
	}
	const post = await prisma.posts.create({ data })

	for (const link of links) link.id_post = post.id

	await prisma.links.createMany({
		data: links,
	})

	return res.redirect(301, '/link')
}

const getPost = async (req, res) => {
	const { username, url } = req.params
	const user = await prisma.users.findFirst({
		where: {
			username,
		},
	})

	if (!user) {
		return res.redirect('/')
	}

	const userPost = await prisma.posts.findFirst({
		where: {
			id_user: user.id,
			url,
		},
		include: {
			links: true,
			user: true,
		},
	})

	if (!userPost) {
		return res.redirect('/')
	}

	await prisma.posts_activity.create({
		data: { id_post: userPost.id },
	})

	console.log(userPost)

	return res.render('../views/pages/linktree', {
		post: userPost,
	})
}

const getLink = async (req, res) => {
	const { id } = req.params
	const link = await prisma.links.findFirst({
		where: {
			id,
		},
		select: {
			id: true,
			link: true,
		},
	})

	// if (!link) return res.redirect('/')

	await prisma.links_activity.create({
		data: { id_link: link.id },
	})

	return res.redirect(link.link)
}

const getPostById = async (req, res) => {
	const { id } = req.params
	const post = await prisma.posts.findFirst({
		where: {
			id,
		},
		include: {
			links: true,
		},
	})

	if (!post)
		return res.send({
			status: 'error',
			msg: 'Post Tidak Ditemukan',
		})

	return res.send({
		status: 'success',
		data: post,
	})
}

module.exports = {
	addPostandLink,
	getPost,
	getLink,
	getPostById,
}
