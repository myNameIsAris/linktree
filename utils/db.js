const mongoose = require('mongoose')
const URI = process.env.MONGODB_URL
const DB = 'linktree'

mongoose.connect(URI + DB)