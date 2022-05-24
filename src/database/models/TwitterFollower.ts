const mongoose = require('mongoose')

const reqString = { type: String, required: true }

const twitterFollowerSchema = mongoose.Schema(
	{
		following: reqString,
		follower: reqString,
	},
	{
		bufferCommands: false,
	},
)

let name = 'twitter-followers'

export default mongoose.models[name] ||
	mongoose.model(name, twitterFollowerSchema)
