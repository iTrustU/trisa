const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const routers = require('./routers');
const telegram = require('./routers/telegram')
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cors());
app.use('/', routers);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server Jalan di port ${PORT}`);
});


module.exports = {
    server
};