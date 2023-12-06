const Joi = require('joi')

const login = Joi.object({
	username: Joi.string().max(100).required(),
	password: Joi.string().required(),
})

const forget = Joi.object({
	email: Joi.string().max(100).email().required(),
})

module.exports = {
	login,
	forget,
}
