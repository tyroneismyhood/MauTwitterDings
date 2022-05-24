import mongoose from 'mongoose'

let connected = false

export default async function () {
	if (connected) return

	await mongoose
		.connect(process.env.MONGO_URI, {
			// useFindAndModify: false,
			// useCreateIndex: true,
			bufferCommands: false,
		})
		.then(() => {
			connected = true
			console.log('Mongo DB Connected ✅')
		})
		.catch((err) => {
			console.log(`Failed to connect to MongoDB.\n${err}`)
		})

	return mongoose
}
