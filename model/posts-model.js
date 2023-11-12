const Mongoose = require('mongoose')

const schema = new Mongoose.Schema(
	{
		id_user: {
			type: Mongoose.Types.ObjectId,
			ref: 'users',
		},
		title: {
			type: String,
			required: true,
		},
		is_deleted: {
			type: Boolean,
			required: true,
			default: false,
		},
		links: [{ type: Mongoose.Types.ObjectId, ref: 'links' }],
	},
	{
		timestamps: true,
	}
)

const posts = Mongoose.model('posts', schema)

module.exports = posts
