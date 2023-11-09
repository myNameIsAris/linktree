const Joi = require('joi')

const createUser = Joi.object({
	email: Joi.string().email().required(),
	username: Joi.string().max(10).required(),
	fullname: Joi.string().max(100).required(),
	password: Joi.string().max(100).required(),
})

module.exports = {
	createUser,
}
