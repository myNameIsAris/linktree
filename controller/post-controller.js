const generator = require('randomstring')
const prisma = require('../utils/database')
const { validate } = require('../validator/validation')
const postValidate = require('../validator/posts-validator')

// VIEW
const getPost = async (req, res) => {
	// Get Request
	const { username, url } = req.params

	// Find Post By Username
	const user = await prisma.users.findFirst({
		where: {
			username,
		},
	})
	if (!user) {
		return res.redirect('/')
	}

	// Find Post By User ID an URL
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

	// Create Activity Post
	const time = new Date()
	const created_at = new Date(
		time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
	)
	await prisma.posts_activity.create({
		data: { id_post: userPost.id, created_at },
	})

	return res.render('../views/pages/linktree', {
		post: userPost,
	})
}

const getLink = async (req, res) => {
	// Get Request
	const { id } = req.params

	// Find Link By ID
	const link = await prisma.links.findFirst({
		where: {
			id,
		},
		select: {
			id: true,
			link: true,
		},
	})

	// Create Activity Link
	const time = new Date()
	const created_at = new Date(
		time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
	)
	await prisma.links_activity.create({
		data: {
			id_link: link.id,
			created_at,
		},
	})

	// Redirect To URL
	return res.redirect(link.link)
}

// API

const addPostandLink = async (req, res) => {
	const [data, error] = validate(postValidate.addPost, req.body)

	if (error) {
		return res.send({
			status: 'error',
			msg: 'Terjadi Kesalahan Dalam Input Post, Silahkan Cek Kembali',
		})
	}
	const { title, links } = data

	const data_ = {
		id_user: req.user.id,
		title,
		url: generator.generate({
			length: 10,
			charset: 'alphabetic',
		}),
	}
	const post = await prisma.posts.create({ data: data_ })

	for (const link of links) link.id_post = post.id

	await prisma.links.createMany({
		data: links,
	})

	req.flash('success', 'Post Berhasil Ditambah')

	return res.send({
		status: 'success',
		redirected: '/link',
	})
}

const editPostandLink = async (req, res) => {
	const [data, error] = validate(postValidate.updatePost, req.body)

	if (error) {
		console.log(error)
		return res.send({
			status: 'error',
			msg: 'Terjadi Kesalahan Dalam Input Post, Silahkan Cek Kembali',
		})
	}

	const { title, links } = data
	const { id } = req.params

	const post = await prisma.posts.findFirst({
		where: {
			id,
		},
	})

	if (!post) return res.redirect('/links')

	await prisma.posts.update({
		where: {
			id,
		},
		data: {
			title,
		},
	})

	for (const link of links) {
		if (link.id) {
			await prisma.links.update({
				where: {
					id: link.id,
				},
				data: {
					title: link.title,
					link: link.link,
				},
			})
			continue
		}
		await prisma.links.create({
			data: {
				id_post: id,
				title: link.title,
				link: link.link,
			},
		})
	}

	req.flash('success', 'Post Berhasil Diupdate')

	return res.send({
		status: 'success',
		redirected: '/link',
	})
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

const getPostActivityById = async (req, res) => {
	const { id } = req.params
	const result = await prisma.posts_activity.groupBy({
		by: ['created_at'],
		where: {
			id_post: id,
		},
		_count: true,
	})
	return res.send({
		status: 'success',
		data: result,
	})
}

const getPostActivityByUser = async (req, res) => {
	const id = req.user.id

	const posts = await prisma.posts.findMany({
		where: {
			id_user: id,
		},
		include: {
			activity: true,
		},
	})
	const allActivity = []
	let i = 0
	for (const d of posts) {
		// Count
		allActivity[i] = {}
		allActivity[i].title = d.title
		allActivity[i].activity = {}

		for (const act of d.activity) {
			const time = new Date(act.created_at)
			const convTime =
				time.getDate() + '-' + (time.getMonth() + 1) + '-' + time.getFullYear()
			allActivity[i].activity[convTime] =
				(allActivity[i].activity[convTime]
					? allActivity[i].activity[convTime]
					: 0) + 1
		}
		i++
	}

	return res.send({
		status: 'success',
		data: allActivity,
	})
}

const getAllVisitor = async (req, res) => {
	const data = await prisma.posts_activity.groupBy({
		by: ['created_at'],
		orderBy: {
			created_at: 'asc',
		},
		_count: true,
	})

	console.log(data)
	return res.send({
		status: 'success',
		data,
	})
}

const deleteLink = async (req, res) => {
	const { id } = req.params
	const { user } = req

	const link = await prisma.links.findFirst({
		where: {
			id,
		},
		include: {
			post: true,
		},
	})

	if (!link) {
		return res.send({
			status: 'error',
			redirected: '/link',
		})
	}

	if (user.id !== link.post.id_user) {
		return res.send({
			status: 'error',
			redirected: '/link',
		})
	}

	await prisma.links.delete({
		where: {
			id,
		},
	})

	return res.send({
		status: 'success',
	})
}

const deletePost = async (req, res) => {
	const { id } = req.params
	const { user } = req

	const post = await prisma.posts.findFirst({
		where: {
			id,
			id_user: user.id,
		},
	})

	if (!post) {
		return res.send({
			status: 'Fail',
			msg: 'Post Tidak Ditemukan',
		})
	}

	await prisma.links.deleteMany({
		where: {
			id_post: id,
		},
	})

	await prisma.posts.delete({
		where: {
			id,
		},
	})

	return res.send({
		status: 'success',
	})
}

module.exports = {
	addPostandLink,
	editPostandLink,
	getPost,
	getLink,
	getPostById,
	getPostActivityById,
	getPostActivityByUser,
	getAllVisitor,
	deleteLink,
	deletePost,
}
