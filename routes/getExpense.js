const dbExpense = require('../models/expense')

module.exports = (req, res) => {
    var query = { $and: [{ createdBy: req.decoded.email }, { status: { $ne: -1 } }] }
    if (req.body.startDate && req.body.endDate) {
        var gt, lt;
        if (req.body.startDate == req.body.endDate) {
            gt = new Date(req.body.startDate)
            lt = new Date(gt.getFullYear(), gt.getMonth(), gt.getDate() + 1)
        } else {
            gt = new Date(req.body.startDate);
            lt = req.body.endDate
        }
        query.$and.push({
            'createdAt': { "$gte": gt, "$lte": lt }
        })
    } else if (req.body.endDate) {
        var end = new Date()

        var start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 90)
        query.$and.push({
            'createdAt': { "$gte": start, "$lte": req.body.endDate }
        })
    } else if (req.body.startDate) {
        query.$and.push({
            'createdAt': { "$gte": req.body.startDate }
        })
    }
    dbExpense.find(query, (err, expenses) => {
        if (err) {
            res.json({
                success: false,
                msg: "Server Error. Please try again after some time."
            })
        } else if (!expenses || expenses.length == 0) {
            res.json({
                success: false,
                msg: "No expenses found"
            })
        } else {
            res.json({
                success: true,
                msg: "All expenses.",
                expenses: expenses
            })
        }
    })
}