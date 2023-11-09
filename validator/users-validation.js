const Joi = require('joi')

const createUser = Joi.object({
	username: Joi.string().max(10).required(),
	fullname: Joi.string().max(100).required(),
	password: Joi.string().max(100).required(),
	email: Joi.string().email().required(),
})

module.exports = {
	createUser,
}
