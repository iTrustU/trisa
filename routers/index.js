const express = require('express')
const router = express.Router()
const axios = require('axios')
const engine = require('../engine')

const tolineFormat = (replies) => {
 return replies.map(message => {
	 if (message.type === 'text') {
			return {
				type:'text',
				text:message.data
			}
	 } else {
		 let lineFormat = {
			 type:'template',
			 altText:'this is a carousel template',
			 template:{
				 type:'carousel',
				 columns:[],
			 }
		 }
		 lineFormat.template.columns = message.data.map(agent => {
			 return {
				 thumbnailImageUrl:agent.picture,
				 title:agent.name,
				 text:`company:${agent.company}, rating:${agent.rating}`,
				 actions:[{
					 type:'uri',
					 label:'detail',
					 uri:`https://itrustu-a10b5.firebaseapp.com/profile/${agent.id}`
				 }]
			 }
		 }).filter(agent => agent.title !== undefined)
		 return lineFormat
	 }
 })
}

const PostLineReply = (replyToken, messages) => {
	axios({
		method:'post',
		url:'https://api.line.me/v2/bot/message/reply',
		headers:{
			'Content-Type':'application/json',
			'Authorization':`Bearer ${process.env.LINE_TOKEN}`
		},
		data:{
			replyToken:replyToken,
			messages:messages,
		}
	}).then(response => {
	}).catch(err => {
		console.log(err.response.data);
	})
}



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

router.post('/line', function(req, res) {
	req.body.events.forEach(event => {
		const { replyToken, source, message } = event
		console.log(replyToken,source,message)
		if (message.type === 'text' ) {
			engine(source.userId, message.text)
				.then(data => {
					const sendData = tolineFormat(data)
					PostLineReply(replyToken,sendData)
				})
				.catch(err => {
					console.log(err)
				})
		}
	})
})


module.exports = router
