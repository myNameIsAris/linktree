const Users = require('../model/users-model')
const prisma = require('../utils/database')

const dashboard = async (req, res) => {
	const user = req.user
	const id = req.user.id

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
				time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
			allActivity[i].activity[convTime] =
				(allActivity[i].activity[convTime]
					? allActivity[i].activity[convTime]
					: 0) + 1
		}
		i++
	}

	const count = {
		viewer,
		linkCount,
		postCount,
	}

	return res.render('../views/pages/dashboard/dashboard', {
		user,
		count,
		activity: JSON.stringify(allActivity),
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
		success: req.flash('success')[0],
		error: req.flash('error')[0],
	})
}

module.exports = {
	dashboard,
	link,
	admin,
}
