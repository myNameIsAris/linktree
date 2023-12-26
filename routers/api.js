const express = require('express')

const router = new express.Router()

// Controller
const authController = require('../controller/auth-controller')
const postController = require('../controller/post-controller')

const { authenticate } = require('../middleware/auth-middleware')

router.post('/upload', async (req, res) => {
	if (!req.files) {
		return res.status(400).json({ msg: 'No file uploaded' })
	}

	console.log(req.files)
	const files = req.files.files

	const filesName = []
	const date = +new Date()
	for (const file of files) {
		if (!file) break
		const fileName = date + '-' + file.name
		filesName.push(fileName)
		await file.mv(__dirname + '/../public/document/' + fileName)
	}

	return res.send({ filesName })
})

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/send-email-user', authController.sendEmailAllUser)
router.get('/post-activity/all', postController.getAllVisitor)
router.post('/reset-password', authController.forgetPassword)
router.post('/forget-password/', authController.changePassword)

router.use(authenticate)
router.get('/post-activity/user', postController.getPostActivityByUser)
router.get('/post-activity/:id', postController.getPostActivityById)
router.post('/post-link', postController.addPostandLink)
router.put('/post-link/:id', postController.editPostandLink)
router.get('/post/:id', postController.getPostById)
router.delete('/link/:id', postController.deleteLink)
router.delete('/post/:id', postController.deletePost)
module.exports = router
