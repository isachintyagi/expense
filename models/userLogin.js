const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userLogin = new Schema({
    email: String,
    name: String,
    password: String,
    fb: {
        id: String,
        name: String,
        token: String,
        login: Boolean,
        email: String
    },
    google: {
        id: String,
        name: String,
        token: String,
        login: Boolean,
        email: String
    },
    lastLogin: [Date]
})

module.exports = mongoose.model("userLogin", userLogin)