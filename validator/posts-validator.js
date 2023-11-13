const Joi = require('joi')

const addPost = Joi.object({
	title: Joi.string().max(100).required(),
	links: Joi.array().items(
		Joi.object({
			title: Joi.string().max(100).required(),
			link: Joi.string().uri().required(),
		})
	),
})

module.exports = {
	addPost,
}
