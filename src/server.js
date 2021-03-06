const express = require('express')

const app = express()
const port = process.env.PORT || 5000

app.use('/characters', require('./api/characters'))

app.listen(port, () => { console.log('Server started on port ' + port) })