const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Status
 * 0 -- OK
 * 1 -- Deleted
 */


const expense = new Schema({
    createdBy: String,
    createdAt: Date,
    month: Number,
    year: Number,
    details: String,
    amount: Number,
    type: {
        type: String,
        enum: ['credit', 'debit']
    },
    status: Number
})


module.exports = mongoose.model("expense", expense)