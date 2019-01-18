const mongoose = require('mongoose')
const express = require('express')
const app = express()
const config = require('./config/config.json')
const bodyParser = require('body-parser')
const port = process.env.port || config.port
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: true }))

app.set('secretKey', config.secret)

mongoose.connect(config.mongo_uri, { useNewUrlParser: true }, err => {
    if (!err) {
        console.log("Database connected.")
    }
})

const api = require('./routes/routes')
app.use('/api', api)


app.listen(port, err => {
    if (!err) {
        console.log(`Server started at port ${port}`)
    } else {
        console.log("Error. Server not started.")
    }
})