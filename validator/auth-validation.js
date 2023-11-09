const Joi = require('joi')

const login = Joi.object({
	username: Joi.string().max(100).required(),
	password: Joi.string().required(),
})

module.exports = {
	login,
}
