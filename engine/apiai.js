const apiai = require('apiai');
require('dotenv').config();

const app = apiai(process.env.APIAI);

const getApiai = ((sessionId, message) => {
    return new Promise((res, rej) => {
        const request = app.textRequest(message, {
            sessionId: sessionId,
        })
        request.on('response', response => {
            res(response.result)
        })
        request.on('error', err => {
            rej(err)
        })
        request.end()
    })
});

const getParameter = ((userID, message) => {
    return getApiai(userID, message).then((res) => {
        const output = {
            action: res.action,
            parameters: res.parameters,
            fulfillment: res.fulfillment,
        }
        return output
    })
})

module.exports = getParameter
