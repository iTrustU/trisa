const express = require('express');
const router = express.Router()

router.post('/local', function(req,res) {
  res.send('masuk')
})


module.exports = router
