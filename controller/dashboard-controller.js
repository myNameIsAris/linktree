const Users = require('../model/users-model')
const Posts = require('../model/posts-model')
const prisma = require('../utils/database')

const dashboard = async (req, res) => {
	const user = req.user

	const viewer = await prisma.posts_activity.count({
		where: {
			post: {
				user: {
					id: req.user.id,
				},
			},
		},
	})

	const linkCount = await prisma.links.count({
		where: {
			post: {
				user: {
					id: req.user.id,
				},
			},
		},
	})
	const postCount = await prisma.posts.count({
		where: {
			user: {
				id: req.user.id,
			},
		},
	})

	const count = {
		viewer,
		linkCount,
		postCount,
	}

	return res.render('../views/pages/dashboard/dashboard', {
		user,
		count,
	})
}

const admin = async (req, res) => {
	const user = req.user

	if (user.role !== 1) {
		return res.redirect('/dashboard')
	}

	const viewer = await prisma.posts_activity.count()
	const linkCount = await prisma.links.count()
	const postCount = await prisma.posts.count()

	const count = {
		viewer,
		linkCount,
		postCount,
	}

	return res.render('../views/pages/dashboard/admin', {
		user,
		count,
	})
}

const link = async (req, res) => {
	const user = req.user

	const posts = await prisma.posts.findMany({
		where: {
			id_user: req.user.id,
		},
		include: {
			links: true,
			user: true,
		},
	})

	return res.render('../views/pages/dashboard/link', {
		user,
		posts,
	})
}

module.exports = {
	dashboard,
	link,
	admin,
}
