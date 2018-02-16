const TelegramBot = require('node-telegram-bot-api');
const engine = require('../engine')
require('dotenv').config()

const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });


// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    engine(msg.chat.id, msg.text).then(data => {
        data.forEach(reply => {
            if (reply.type === 'text') {
                bot.sendMessage(chatId, reply.data);
            } else {
                reply.data.forEach(message => {
                  bot.sendPhoto(chatId,message.picture,{
                    caption:`name:${message.name}
company:${message.company}
city:${message.city}
profile:https://itrustu-a10b5.firebaseapp.com/profile/${message.id}
                    `
                  })
                })
            }
        });
    }).catch(err => {
        console.log(err)
    })

});
