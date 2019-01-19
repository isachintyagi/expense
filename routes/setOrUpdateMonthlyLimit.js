const dbLimits = require('../models/monthlyLimit')
const val = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

exports.setLimit = (req, res) => {
    if (!req.body.amount) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        let todayDate = new Date(),
            currentMonth = todayDate.getMonth(),
            currentYear = todayDate.getFullYear()
        dbLimits.findOne({ email: req.decoded.email }, (err, limits) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Server Error. Please try agian after some time."
                })
            } else if (!limits || limits == null) {
                new dbLimits({
                    email: req.decoded.email,
                    limits: [{
                        month: currentMonth,
                        year: currentYear,
                        amount: req.body.amount
                    }]
                }).save((err, saved) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Please try again after some time. Server Error."
                        })
                    } else {
                        res.json({
                            success: true,
                            msg: "Limit set for the given month."
                        })
                    }
                })
            } else {
                let exists = false;
                limits.limits.length == 0 ? console.log("Not exists") : limits.limits.forEach(element => {
                    if (element.year == currentYear && element.month == currentMonth)
                        exists = true
                });
                if (exists) {
                    res.json({
                        success: false,
                        msg: "Limit for the given month already exists. Please update the limit."
                    })
                } else {
                    let lim = {
                        month: currentMonth,
                        year: currentYear,
                        amount: req.body.amount
                    }
                    dbLimits.findOneAndUpdate({ email: req.decoded.email }, { $push: { limits: lim } }, (err, updated) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: "Please try again after some time. "
                            })
                        } else {
                            res.json({
                                success: true,
                                msg: "Limit set for the given month."
                            })
                        }
                    })
                }
            }
        })
    }
}

exports.updateLimit = (req, res) => {
    let todayDate = new Date(),
        currentMonth = todayDate.getMonth(),
        currentYear = todayDate.getFullYear()
    if (!req.body.amount) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        dbLimits.findOneAndUpdate({ email: req.body.email, 'limits.year': currentYear, 'limits.month': currentMonth }, { $set: { 'limits.$.amount': req.body.amount } }, (err, updated) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Please try again after some time. "
                })
            } else {
                res.json({
                    success: true,
                    msg: "Limit set for the given month."
                })
            }
        })
    }
}