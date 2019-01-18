const mongoose = require('mongoose')
const Schema = mongoose.Schema


const limit = new Schema({
    email: {
        type: String,
        unique: true
    },
    limits: [{
        month: Number,
        year: Number,
        amount: Number
    }]
})


module.exports = mongoose.model("limit", limit)