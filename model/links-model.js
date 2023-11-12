const Mongoose = require('mongoose')

const schema = new Mongoose.Schema(
	{
		id_post: {
			type: Mongoose.Types.ObjectId,
			ref: 'posts',
		},
		title: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		is_deleted: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

const links = Mongoose.model('links', schema)

module.exports = links
