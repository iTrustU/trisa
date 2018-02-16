const express = require('express')
const router = express.Router()
const engine = require('../engine')

router.post('/local', function(req, res) {
	const { message, id } = req.body
	engine(id, message)
		.then(data => {
			const sendData = data.map(message => {
				message.sender = 'bot'
				return message
			})
			res.send(sendData)
		})
		.catch(err => {
			res.status(500).send(err)
		})
})


module.exports = router
