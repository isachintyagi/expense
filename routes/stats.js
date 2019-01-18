const dbExpenses = require('../models/expense')
const dbLimits = require('../models/monthlyLimit')

module.exports = (req, res) => {
    let todayDate = new Date(),
        currentMonth = todayDate.getMonth(),
        currentYear = todayDate.getFullYear()
    dbLimits.findOne({ email: req.decoded.email }, (err, limit) => {
        if (err) {
            res.json({
                success: false,
                msg: "Something went wrong. Please try again after some time."
            })
        } else if (!limit || limit == null) {
            res.json({
                success: true,
                msg: "All stats",
                totalLimit: 0,
                spent: 0
            })
        } else if (limit.limits.length == 0) {
            res.json({
                success: true,
                msg: "All stats",
                totalLimit: 0,
                spent: 0
            })
        } else {
            let limitAmount = 0;
            limit.limits.forEach(element => {
                if (element.month == currentMonth && element.year == currentYear) {
                    limitAmount = e.amount
                }
            });
            dbExpenses.find({ createdBy: req.decoded.email, month: currentMonth, year: currentYear, status: { $ne: -1 } }, (err, expenses) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "Something went wrong. Please try again after some time."
                    })
                } else if (!expenses || expenses.length == 0) {
                    res.json({
                        success: true,
                        msg: "All stats",
                        totalLimit: limitAmount,
                        spent: 0
                    })
                } else {
                    let total = 0;
                    expenses.forEach(e => {
                        if (e.type == 'credit') {
                            total -= e.amount
                        } else {
                            total += e.amount
                        }
                    })
                    res.json({
                        success: true,
                        msg: "All stats",
                        totalLimit: limitAmount,
                        spent: total
                    })
                }
            })
        }
    })
}