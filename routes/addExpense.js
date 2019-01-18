const dbExpense = require('../models/expense')

module.exports = (req, res) => {
    if (!req.body.amount || !req.body.type || !req.body.details) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        let todayDate = new Date(),
            currentMonth = todayDate.getMonth(),
            currentYear = todayDate.getFullYear()
        new dbExpense({
            createdBy: req.decoded.email,
            createdAt: new Date(),
            month: currentMonth,
            year: currentYear,
            details: req.body.details,
            amount: req.body.amount,
            type: req.body.type,
            status: 0
        }).save((err, saved) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Server Error. Please try again after some time."
                })
            } else {
                res.json({
                    success: true,
                    msg: "Expense added."
                })
            }
        })
    }
}