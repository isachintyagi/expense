const dbExpense = require('../models/expense')

module.exports = (req, res) => {
    if (!req.body.amount || !req.body.type || !req.body.details || !req.body.type || !req.body.id) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        var ex = {
            details: req.body.details,
            amount: req.body.amount,
            type: req.body.type
        }
        dbExpense.findOneAndUpdate({ _id: req.body.id }, { $set: ex }, (err, saved) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Server Error. Please try again after some time."
                })
            } else {
                res.json({
                    success: true,
                    msg: "Expense updated."
                })
            }
        })
    }
}