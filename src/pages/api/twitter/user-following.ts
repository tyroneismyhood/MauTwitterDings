import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import mongo from '../../../database/mongo'
import TwitterFollower from '../../../database/models/TwitterFollower'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === 'GET') {
		let follower = req.query.follower
		let following = req.query.following

		if (!follower || !following) {
			return res.status(400).json({ message: 'Invalid paremeters' })
		}

		await mongo()

		// check authorization
		if (req.headers.authorization !== process.env.AUTH) { // bullshit error it works
			return res.status(401).json({ message: 'Unauthorized' })
		}

		let doc = await TwitterFollower.findOne({
			follower,
			following,
		})

		if (!doc) {
			return res.status(200).json({ isFollowing: false })
		}

		return res.status(200).json({
			isFollowing: true,
		})
	} else if (req.method === 'POST') {
		let authorization = req.headers.authorization
		let following = req.query.following

		if (!authorization || !following) {
			return res.status(400).json({ message: 'Invalid parameters' })
		}

		if (authorization !== process.env.AUTH) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		await mongo()

		let done = 0

		for (let i = 0; i < req.body.length; i++) {
			let follower = req.body[i]

			await TwitterFollower.findOneAndUpdate(
				{ follower, following },
				{ follower, following },
				{ upsert: true },
			)

			done++
		}

		console.log('Posted ' + done + ' followers - ' + following)

		res.status(200).json({
			message: 'Success',
			amount: done,
		})
	} else {
		return res
			.status(405)
			.end(JSON.stringify({ message: 'Method not allowed' }))
	}
}
