const Mongoose = require('mongoose')

const Posts = require('./posts-model')

const schema = new Mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	fullname: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		required: false,
	},
	posts: [
		{
			type: Mongoose.Types.ObjectId,
			ref: 'posts',
		},
	],
})

const users = Mongoose.model('users', schema)

module.exports = users
