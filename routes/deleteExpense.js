const dbExpense = require('../models/expense')

module.exports = (req, res) => {
    if (!req.body.id) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        dbExpense.findOneAndUpdate({ _id: req.body.id }, { $set: { status: -1 } }, (err, updated) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Server Error. Please try again after some time."
                })
            } else {
                res.json({
                    success: true,
                    msg: "Expense deleted."
                })
            }
        })
    }
}